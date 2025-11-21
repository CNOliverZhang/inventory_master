import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

// 扩展 Express Request 接口
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * 认证中间件
 * 验证 JWT Token 并将用户信息附加到 request 对象
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
      });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证 token
    const decoded = verifyToken(token);
    
    // 将用户信息附加到 request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '认证失败，请重新登录',
      error: error instanceof Error ? error.message : 'Invalid token',
    });
  }
};
