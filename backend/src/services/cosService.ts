import COS from 'cos-nodejs-sdk-v5';
import dotenv from 'dotenv';

dotenv.config();

// 初始化 COS 客户端
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID || '',
  SecretKey: process.env.COS_SECRET_KEY || '',
});

const Bucket = process.env.COS_BUCKET || '';
const Region = process.env.COS_REGION || 'ap-guangzhou';

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * 上传文件到腾讯云 COS
 * @param fileBuffer 文件缓冲区
 * @param filename 文件名（包含扩展名）
 * @param contentType 内容类型（可选）
 * @returns 上传结果，包含 URL 和 Key
 */
export const uploadFile = async (
  fileBuffer: Buffer,
  filename: string,
  contentType?: string
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const key = `materials/${filename}`;

    const uploadOptions: any = {
      Bucket,
      Region,
      Key: key,
      Body: fileBuffer,
    };

    // 如果提供了 contentType，则设置
    if (contentType) {
      uploadOptions.ContentType = contentType;
    }

    cos.putObject(uploadOptions, (err) => {
      if (err) {
        reject(err);
      } else {
        const url = `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;
        resolve({ url, key });
      }
    });
  });
};

/**
 * 删除 COS 中的文件
 * @param key 文件的 Key
 */
export const deleteFile = async (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket,
        Region,
        Key: key,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

/**
 * 从 URL 中提取 COS Key
 * @param url 完整的 COS URL
 * @returns COS Key
 */
export const getKeyFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  return urlObj.pathname.substring(1); // 去掉开头的 /
};
