import svgCaptcha from 'svg-captcha';
import crypto from 'crypto';
import redisClient from '../config/redis';

/**
 * 生成验证码图片（SVG格式）
 */
export const generateCaptcha = (options: {
  width?: number;
  height?: number;
  length?: number;
} = {}): { code: string; image: string } => {
  const { width = 120, height = 40, length = 4 } = options;

  const captcha = svgCaptcha.create({
    size: length,
    noise: 2,
    color: true,
    background: '#f0f0f0',
    width,
    height,
    fontSize: 50,
    ignoreChars: '0oO1ilI',
  });

  return {
    code: captcha.text.toLowerCase(),
    image: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
  };
};

/**
 * 生成验证码token
 */
export const generateCaptchaToken = (): string => {
  return crypto
    .createHash('md5')
    .update(`${Date.now()}_${Math.random()}`)
    .digest('hex');
};

/**
 * 保存验证码到Redis
 */
export const saveCaptcha = async (
  token: string,
  code: string,
  expiresIn: number = 300 // 默认5分钟
): Promise<void> => {
  await redisClient.set(`captcha:${token}`, code.toLowerCase());
  await redisClient.expire(`captcha:${token}`, expiresIn);
};

/**
 * 验证验证码
 */
export const verifyCaptcha = async (
  token: string,
  code: string
): Promise<boolean> => {
  const correctCode = await redisClient.get(`captcha:${token}`);

  if (!correctCode) {
    return false;
  }

  const isValid = correctCode === code.toLowerCase();

  if (isValid) {
    // 验证成功后删除验证码（防止重复使用）
    await redisClient.del(`captcha:${token}`);
  }

  return isValid;
};
