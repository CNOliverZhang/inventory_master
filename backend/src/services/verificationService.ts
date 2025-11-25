import redis from '../config/redis';
import crypto from 'crypto';

// Redis key 前缀
const VERIFICATION_PREFIX = 'verification:';
const PENDING_USER_PREFIX = 'pending_user:';

/**
 * 生成6位数字验证码
 */
export const generateVerificationCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * 保存待验证的用户信息到 Redis
 * @param email 用户邮箱
 * @param userData 用户数据（username, email, password）
 * @param code 验证码
 * @param expirationInSeconds 过期时间（秒），默认30分钟
 */
export const savePendingUser = async (
  email: string,
  userData: { username: string; email: string; password: string },
  code: string,
  expirationInSeconds: number = 1800 // 30分钟
): Promise<void> => {
  const userKey = PENDING_USER_PREFIX + email;
  const codeKey = VERIFICATION_PREFIX + email;

  // 保存用户数据
  await redis.setex(userKey, expirationInSeconds, JSON.stringify(userData));

  // 保存验证码
  await redis.setex(codeKey, expirationInSeconds, code);
};

/**
 * 验证验证码
 * @param email 用户邮箱
 * @param code 验证码
 * @returns 验证成功返回用户数据，失败返回 null
 */
export const verifyCode = async (
  email: string,
  code: string
): Promise<{ username: string; email: string; password: string } | null> => {
  const userKey = PENDING_USER_PREFIX + email;
  const codeKey = VERIFICATION_PREFIX + email;

  // 获取保存的验证码
  const savedCode = await redis.get(codeKey);

  if (!savedCode || savedCode !== code) {
    return null;
  }

  // 验证码正确，获取用户数据
  const userDataStr = await redis.get(userKey);

  if (!userDataStr) {
    return null;
  }

  const userData = JSON.parse(userDataStr);

  // 验证成功后删除 Redis 中的数据
  await redis.del(userKey);
  await redis.del(codeKey);

  return userData;
};

/**
 * 检查邮箱是否有待验证的注册
 * @param email 用户邮箱
 * @returns 如果存在返回 true，否则返回 false
 */
export const hasPendingRegistration = async (email: string): Promise<boolean> => {
  const userKey = PENDING_USER_PREFIX + email;
  const exists = await redis.exists(userKey);
  return exists === 1;
};

/**
 * 删除待验证的用户信息
 * @param email 用户邮箱
 */
export const deletePendingUser = async (email: string): Promise<void> => {
  const userKey = PENDING_USER_PREFIX + email;
  const codeKey = VERIFICATION_PREFIX + email;

  await redis.del(userKey);
  await redis.del(codeKey);
};

/**
 * 获取验证码剩余有效时间（秒）
 * @param email 用户邮箱
 * @returns 剩余秒数，-1 表示不存在或已过期
 */
export const getCodeTTL = async (email: string): Promise<number> => {
  const codeKey = VERIFICATION_PREFIX + email;
  return await redis.ttl(codeKey);
};

/**
 * 重新发送验证码（更新过期时间）
 * @param email 用户邮箱
 * @param code 新验证码
 * @param expirationInSeconds 过期时间（秒）
 */
export const resendVerificationCode = async (
  email: string,
  code: string,
  expirationInSeconds: number = 1800
): Promise<boolean> => {
  const userKey = PENDING_USER_PREFIX + email;
  const codeKey = VERIFICATION_PREFIX + email;

  // 检查是否存在待验证用户
  const exists = await redis.exists(userKey);
  if (exists !== 1) {
    return false;
  }

  // 更新验证码和过期时间
  await redis.setex(codeKey, expirationInSeconds, code);

  // 同时更新用户数据的过期时间
  await redis.expire(userKey, expirationInSeconds);

  return true;
};
