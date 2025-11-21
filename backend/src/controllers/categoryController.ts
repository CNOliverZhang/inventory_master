import { Request, Response } from 'express';
import { Category, Material } from '../models';
import { MaterialType } from '../models/Material';
import { Op } from 'sequelize';

/**
 * 获取所有类别（支持按类型筛选）- 仅返回当前用户的类别
 */
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { type } = req.query;
    
    const whereClause: any = {
      userId: req.user.userId,
    };
    
    // 按类型筛选
    if (type && Object.values(MaterialType).includes(type as MaterialType)) {
      whereClause.type = type;
    }
    
    const categories = await Category.findAll({
      where: whereClause,
      order: [['type', 'ASC'], ['createdAt', 'ASC']],
    });
    
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: '获取类别列表失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 根据 ID 获取单个类别 - 验证所有权
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { id } = req.params;
    
    const category = await Category.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '类别不存在或无权访问',
      });
    }
    
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: '获取类别详情失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 创建新类别 - 关联当前用户
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { name, type } = req.body;
    
    // 验证必填字段
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段：name, type',
      });
    }
    
    // 验证类型
    if (!Object.values(MaterialType).includes(type)) {
      return res.status(400).json({
        success: false,
        message: '无效的物资类型',
      });
    }
    
    // 检查是否已存在同名类别
    const existing = await Category.findOne({
      where: {
        userId: req.user.userId,
        type,
        name,
      },
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: '该类型下已存在同名类别',
      });
    }
    
    // 创建类别
    const category = await Category.create({
      userId: req.user.userId,
      name,
      type,
    });
    
    res.status(201).json({
      success: true,
      data: category,
      message: '类别创建成功',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: '创建类别失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 更新类别 - 验证所有权
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '缺少必填字段：name',
      });
    }
    
    const category = await Category.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '类别不存在或无权访问',
      });
    }
    
    // 检查是否与其他类别重名
    const existing = await Category.findOne({
      where: {
        userId: req.user.userId,
        type: category.type,
        name,
        id: { [Op.ne]: id },
      },
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: '该类型下已存在同名类别',
      });
    }
    
    await category.update({ name });
    
    res.json({
      success: true,
      data: category,
      message: '类别更新成功',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: '更新类别失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 删除类别 - 验证所有权
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const { id } = req.params;
    
    const category = await Category.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: '类别不存在或无权访问',
      });
    }
    
    // 检查是否有物资使用该类别
    const materialCount = await Material.count({
      where: {
        categoryId: id,
      },
    });
    
    if (materialCount > 0) {
      return res.status(400).json({
        success: false,
        message: `无法删除：还有 ${materialCount} 个物资使用该类别`,
      });
    }
    
    await category.destroy();
    
    res.json({
      success: true,
      message: '类别删除成功',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: '删除类别失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * 获取类别统计数据
 */
export const getCategoryStatistics = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未认证',
      });
    }

    const userId = req.user.userId;
    
    const categories = await Category.findAll({
      where: { userId },
      attributes: ['id', 'name', 'type'],
    });
    
    // 获取每个类别的物资数量
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Material.count({
          where: {
            categoryId: category.id,
          },
        });
        
        return {
          id: category.id,
          name: category.name,
          type: category.type,
          materialCount: count,
        };
      })
    );
    
    res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    res.status(500).json({
      success: false,
      message: '获取类别统计失败',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
