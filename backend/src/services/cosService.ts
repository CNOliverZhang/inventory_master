import COS from 'cos-nodejs-sdk-v5';
import dotenv from 'dotenv';

dotenv.config();

// 初始化 COS 客户端
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID || '',
  SecretKey: process.env.COS_SECRET_KEY || '',
});

// 用户头像 COS 配置（共享用户体系）
const UserAvatarBucket = process.env.COS_USER_AVATAR_BUCKET || '';
const UserAvatarRegion = process.env.COS_USER_AVATAR_REGION || 'ap-guangzhou';
const UserAvatarCdnBaseUrl = process.env.COS_USER_AVATAR_CDN_BASE_URL || 
  `https://${UserAvatarBucket}.cos.${UserAvatarRegion}.myqcloud.com/`;

// 物资图片 COS 配置（项目专用）
const MaterialBucket = process.env.COS_MATERIAL_BUCKET || '';
const MaterialRegion = process.env.COS_MATERIAL_REGION || 'ap-guangzhou';
const MaterialCdnBaseUrl = process.env.COS_MATERIAL_CDN_BASE_URL || 
  `https://${MaterialBucket}.cos.${MaterialRegion}.myqcloud.com/`;

export interface UploadResult {
  url: string;
  key: string;
}

export interface UploadOptions {
  buffer: Buffer;
  key: string; // 完整的 key 路径（包含前缀和文件名）
  contentType?: string;
  bucket?: 'user' | 'material'; // 指定使用哪个桶
}

export interface DeleteOptions {
  key?: string;
  url?: string;
  bucket?: 'user' | 'material'; // 指定使用哪个桶
}

/**
 * 上传文件到腾讯云 COS（通用方法）
 * @param options 上传选项
 * @returns CDN URL
 */
export const uploadToCos = async (options: UploadOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 根据 bucket 参数选择配置
    let targetBucket: string;
    let targetRegion: string;
    let targetCdnBaseUrl: string;

    if (options.bucket === 'user') {
      targetBucket = UserAvatarBucket;
      targetRegion = UserAvatarRegion;
      targetCdnBaseUrl = UserAvatarCdnBaseUrl;
    } else {
      // 默认使用物资桶
      targetBucket = MaterialBucket;
      targetRegion = MaterialRegion;
      targetCdnBaseUrl = MaterialCdnBaseUrl;
    }

    const uploadOptions: any = {
      Bucket: targetBucket,
      Region: targetRegion,
      Key: options.key,
      Body: options.buffer,
    };

    if (options.contentType) {
      uploadOptions.ContentType = options.contentType;
    }

    cos.putObject(uploadOptions, (err) => {
      if (err) {
        reject(err);
      } else {
        // 返回 CDN URL
        const url = `${targetCdnBaseUrl}${options.key}`;
        resolve(url);
      }
    });
  });
};

/**
 * 删除 COS 中的文件
 * @param options 删除选项，可以是 key 或 url
 */
export const deleteFromCos = async (options: DeleteOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    let key: string;
    
    if (options.key) {
      key = options.key;
    } else if (options.url) {
      key = getKeyFromUrl(options.url, options.bucket);
    } else {
      reject(new Error('必须提供 key 或 url'));
      return;
    }

    // 根据 bucket 参数选择配置
    let targetBucket: string;
    let targetRegion: string;

    if (options.bucket === 'user') {
      targetBucket = UserAvatarBucket;
      targetRegion = UserAvatarRegion;
    } else {
      // 默认使用物资桶
      targetBucket = MaterialBucket;
      targetRegion = MaterialRegion;
    }

    cos.deleteObject(
      {
        Bucket: targetBucket,
        Region: targetRegion,
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
 * @param bucket 指定桶类型（用于判断CDN前缀）
 * @returns COS Key
 */
export const getKeyFromUrl = (url: string, bucket?: 'user' | 'material'): string => {
  try {
    // 根据 bucket 参数选择对应的 CDN 基础 URL
    let cdnBaseUrl;
    
    if (bucket === 'user') {
      cdnBaseUrl = UserAvatarCdnBaseUrl;
    } else {
      cdnBaseUrl = MaterialCdnBaseUrl;
    }

    // 尝试移除对应的 CDN 基础 URL
    if (url.startsWith(cdnBaseUrl)) {
      return url.replace(cdnBaseUrl, '');
    }

    // 尝试移除所有可能的 CDN URL
    if (url.startsWith(UserAvatarCdnBaseUrl)) {
      return url.replace(UserAvatarCdnBaseUrl, '');
    }
    if (url.startsWith(MaterialCdnBaseUrl)) {
      return url.replace(MaterialCdnBaseUrl, '');
    }
    
    // 兼容其他格式的 URL
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // 去掉开头的 /
  } catch (error) {
    // 如果解析失败，假设传入的就是 key
    return url;
  }
};
