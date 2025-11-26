import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN: StringValue = (process.env.JWT_EXPIRES_IN || '7d') as StringValue;

// JWT 载荷接口
export interface JwtPayload {
  userId: number;
  username?: string; // 用户名可选（在注册后可能需要设置）
  email?: string;    // 邮箱可选（可能通过其他方式登录）
  phone?: string;    // 手机号可选
  identifier?: string; // 通用标识符（用于多方式登录）
}

/**
 * 生成 JWT Token
 */
export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * 验证 JWT Token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('无效的 Token');
  }
};
