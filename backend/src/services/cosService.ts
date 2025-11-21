import COS from 'cos-nodejs-sdk-v5';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

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
 * @param originalName 原始文件名
 * @returns 上传结果，包含 URL 和 Key
 */
export const uploadFile = async (
  fileBuffer: Buffer,
  originalName: string
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const ext = path.extname(originalName);
    const filename = `${uuidv4()}${ext}`;
    const key = `materials/${filename}`;

    cos.putObject(
      {
        Bucket,
        Region,
        Key: key,
        Body: fileBuffer,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          const url = `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;
          resolve({ url, key });
        }
      }
    );
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
      (err, data) => {
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
