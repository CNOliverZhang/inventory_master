import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export interface ProcessedImage {
  buffer: Buffer;
  filename: string;
}

/**
 * 生成随机文件名
 * @param prefix 文件名前缀
 * @returns 随机文件名（不含扩展名）
 */
const generateRandomFilename = (prefix: string = 'img'): string => {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(8).toString('hex');
  const uuid = uuidv4().split('-')[0]; // 取UUID的第一段
  return `${prefix}_${timestamp}_${uuid}_${randomStr}`;
};

/**
 * 处理图片：压缩、转换为 WebP 格式、重命名
 * @param fileBuffer 原始图片缓冲区
 * @param options 处理选项
 * @returns 处理后的图片信息
 */
export const processImage = async (
  fileBuffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    prefix?: string;
  } = {}
): Promise<ProcessedImage> => {
  const {
    maxWidth = 1920,      // 最大宽度
    maxHeight = 1920,     // 最大高度
    quality = 80,         // WebP 质量 (1-100)
    prefix = 'material',  // 文件名前缀
  } = options;

  try {
    // 获取图片元数据
    const metadata = await sharp(fileBuffer).metadata();
    
    // 计算新尺寸（保持宽高比）
    let width = metadata.width || maxWidth;
    let height = metadata.height || maxHeight;
    
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // 处理图片：调整大小、转换为 WebP
    const processedBuffer = await sharp(fileBuffer)
      .resize(width, height, {
        fit: 'inside',          // 保持宽高比，确保在限制内
        withoutEnlargement: true, // 不放大小图片
      })
      .webp({
        quality,                  // WebP 质量
        effort: 4,                // 压缩努力程度 (0-6)，4 是平衡点
      })
      .toBuffer();

    // 生成随机文件名
    const filename = `${generateRandomFilename(prefix)}.webp`;

    // 计算压缩比例
    const originalSize = fileBuffer.length;
    const compressedSize = processedBuffer.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    
    console.log(`图片处理完成: ${filename}`);
    console.log(`- 原始大小: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`- 压缩后大小: ${(compressedSize / 1024).toFixed(2)} KB`);
    console.log(`- 压缩率: ${compressionRatio}%`);
    console.log(`- 尺寸: ${width}x${height}`);

    return {
      buffer: processedBuffer,
      filename,
    };
  } catch (error) {
    console.error('图片处理失败:', error);
    throw new Error('图片处理失败');
  }
};

/**
 * 验证是否为图片文件
 * @param fileBuffer 文件缓冲区
 * @returns 是否为有效图片
 */
export const isValidImage = async (fileBuffer: Buffer): Promise<boolean> => {
  try {
    const metadata = await sharp(fileBuffer).metadata();
    // 检查是否为支持的图片格式
    const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'tiff', 'avif'];
    return validFormats.includes(metadata.format || '');
  } catch (error) {
    return false;
  }
};
