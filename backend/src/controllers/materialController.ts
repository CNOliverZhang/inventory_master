import { Request, Response } from 'express';
import { Material, Category } from '../models';
import { MaterialType } from '../models/Material';
import { uploadFile, deleteFile, getKeyFromUrl } from '../services/cosService';
import { processImage, isValidImage } from '../services/imageService';
import { Op } from 'sequelize';

/**
 * 获取所有物资（支持分类筛选和搜索）- 仅返回当前用户的物资
 */
export const getAllMaterials = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { type, search } = req.query;
    
    const whereClause: any = {
      userId: req.user.userId, // 只查询当前用户的物资
    };
    
    // 按类型筛选
    if (type && Object.values(MaterialType).includes(type as MaterialType)) {
      whereClause.type = type;
    }
    
    // 按名称搜索
    if (search && typeof search === 'string') {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    
    const materials = await Material.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'type'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      message: '获取物资列表失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 根据 ID 获取单个物资 - 验证所有权
 */
export const getMaterialById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { id } = req.params;
    
    const material = await Material.findOne({
      where: {
        id,
        userId: req.user.userId, // 验证所有权
      },
    });
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: '物资不存在或无权访问',
      });
    }
    
    res.json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({
      success: false,
      message: '获取物资详情失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 创建新物资 - 关联当前用户
 */
export const createMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { name, type, categoryId, location, quantity, inUseQuantity, stockQuantity } = req.body;
    
    // 验证必填字段
    if (!name || !type || !location) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段：name, type, location',
      });
    }
    
    // 验证类型
    if (!Object.values(MaterialType).includes(type)) {
      return res.status(400).json({
        success: false,
        message: '无效的物资类型',
      });
    }
    
    let photoUrl: string | undefined;
    
    // 处理照片上传
    if (req.file) {
      // 验证是否为有效图片
      const isValid = await isValidImage(req.file.buffer);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: '上传的文件不是有效的图片格式',
        });
      }

      // 处理图片：压缩、转换为 WebP、重命名
      const processedImage = await processImage(req.file.buffer, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 80,
        prefix: 'material',
      });

      // 上传到 COS
      const uploadResult = await uploadFile(
        processedImage.buffer,
        processedImage.filename,
        'image/webp'
      );
      photoUrl = uploadResult.url;
    }
    
    // 创建物资
    const materialData: any = {
      userId: req.user.userId, // 关联当前用户
      name,
      type,
      categoryId: categoryId || null,
      location,
      photoUrl,
    };
    
    // 根据类型设置数量字段
    if (type === MaterialType.STUDIO) {
      materialData.inUseQuantity = inUseQuantity || 0;
      materialData.stockQuantity = stockQuantity || 0;
    } else if (type === MaterialType.MISC) {
      materialData.quantity = quantity || 0;
    }
    
    const material = await Material.create(materialData);
    
    res.status(201).json({
      success: true,
      data: material,
      message: '物资创建成功',
    });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({
      success: false,
      message: '创建物资失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 更新物资 - 验证所有权
 */
export const updateMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { id } = req.params;
    const { name, categoryId, location, quantity, inUseQuantity, stockQuantity } = req.body;
    
    const material = await Material.findOne({
      where: {
        id,
        userId: req.user.userId, // 验证所有权
      },
    });
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: '物资不存在或无权访问',
      });
    }
    
    let photoUrl = material.photoUrl;
    
    // 处理新照片上传
    if (req.file) {
      // 验证是否为有效图片
      const isValid = await isValidImage(req.file.buffer);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: '上传的文件不是有效的图片格式',
        });
      }

      // 删除旧照片
      if (material.photoUrl) {
        try {
          const oldKey = getKeyFromUrl(material.photoUrl);
          await deleteFile(oldKey);
        } catch (error) {
          console.error('Error deleting old photo:', error);
        }
      }
      
      // 处理图片：压缩、转换为 WebP、重命名
      const processedImage = await processImage(req.file.buffer, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 80,
        prefix: 'material',
      });

      // 上传新照片到 COS
      const uploadResult = await uploadFile(
        processedImage.buffer,
        processedImage.filename,
        'image/webp'
      );
      photoUrl = uploadResult.url;
    }
    
    // 更新物资
    const updateData: any = {
      name: name || material.name,
      categoryId: categoryId !== undefined ? categoryId : material.categoryId,
      location: location || material.location,
      photoUrl,
    };
    
    // 根据类型更新数量字段
    if (material.type === MaterialType.STUDIO) {
      if (inUseQuantity !== undefined) updateData.inUseQuantity = inUseQuantity;
      if (stockQuantity !== undefined) updateData.stockQuantity = stockQuantity;
    } else if (material.type === MaterialType.MISC) {
      if (quantity !== undefined) updateData.quantity = quantity;
    }
    
    await material.update(updateData);
    
    res.json({
      success: true,
      data: material,
      message: '物资更新成功',
    });
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({
      success: false,
      message: '更新物资失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 删除物资 - 验证所有权
 */
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { id } = req.params;
    
    const material = await Material.findOne({
      where: {
        id,
        userId: req.user.userId, // 验证所有权
      },
    });
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: '物资不存在或无权访问',
      });
    }
    
    // 删除关联的照片
    if (material.photoUrl) {
      try {
        const key = getKeyFromUrl(material.photoUrl);
        await deleteFile(key);
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
    
    await material.destroy();
    
    res.json({
      success: true,
      message: '物资删除成功',
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      message: '删除物资失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 获取统计数据 - 仅统计当前用户的物资
 */
export const getStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const userId = req.user.userId;
    
    const stats = {
      total: await Material.count({ where: { userId } }),
      studio: await Material.count({ where: { userId, type: MaterialType.STUDIO } }),
      clothing: await Material.count({ where: { userId, type: MaterialType.CLOTHING } }),
      misc: await Material.count({ where: { userId, type: MaterialType.MISC } }),
    };
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
