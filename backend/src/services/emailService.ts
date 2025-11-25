import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.exmail.qq.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

// 验证邮件配置
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP 配置错误:', error);
  } else {
    console.log('✅ SMTP 服务器已就绪');
  }
});

/**
 * 发送验证码邮件
 */
export const sendVerificationEmail = async (
  email: string,
  code: string,
  username?: string
): Promise<void> => {
  const fromName = process.env.SMTP_FROM_NAME || '物资管理系统';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: '欢迎注册 - 邮箱验证',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #0cb9c1 0%, #00aeff 100%);
            border-radius: 10px;
            padding: 30px;
            color: white;
          }
          .content {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-top: 20px;
            color: #333;
          }
          .code {
            background: #f0f9ff;
            border: 2px dashed #0cb9c1;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #0cb9c1;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin-top: 20px;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="margin: 0; font-size: 24px;">📦 物资管理系统</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Inventory Master System</p>
        </div>
        
        <div class="content">
          <h2 style="color: #0cb9c1; margin-top: 0;">欢迎注册！</h2>
          
          ${username ? `<p>你好，<strong>${username}</strong>！</p>` : '<p>你好！</p>'}
          
          <p>感谢您注册物资管理系统。请使用以下验证码完成邮箱验证：</p>
          
          <div class="code">${code}</div>
          
          <p><strong>验证码有效期：30分钟</strong></p>
          
          <div class="warning">
            ⚠️ <strong>安全提示：</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>请勿将验证码透露给他人</li>
              <li>如非本人操作，请忽略此邮件</li>
              <li>验证码仅用于本次注册，请勿在其他场合使用</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>此邮件由系统自动发送，请勿直接回复</p>
          <p>&copy; ${new Date().getFullYear()} 物资管理系统 | Inventory Master</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * 发送重置密码邮件（未来扩展）
 */
export const sendPasswordResetEmail = async (
  email: string,
  code: string,
  username?: string
): Promise<void> => {
  const fromName = process.env.SMTP_FROM_NAME || '物资管理系统';
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: email,
    subject: '密码重置 - 验证码',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #0cb9c1 0%, #00aeff 100%);
            border-radius: 10px;
            padding: 30px;
            color: white;
          }
          .content {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-top: 20px;
            color: #333;
          }
          .code {
            background: #fff3f3;
            border: 2px dashed #ff4757;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #ff4757;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin-top: 20px;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="margin: 0; font-size: 24px;">📦 物资管理系统</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Inventory Master System</p>
        </div>
        
        <div class="content">
          <h2 style="color: #ff4757; margin-top: 0;">🔐 密码重置</h2>
          
          ${username ? `<p>你好，<strong>${username}</strong>！</p>` : '<p>你好！</p>'}
          
          <p>您正在重置密码。请使用以下验证码继续操作：</p>
          
          <div class="code">${code}</div>
          
          <p><strong>验证码有效期：30分钟</strong></p>
          
          <div class="warning">
            ⚠️ <strong>安全提示：</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>如非本人操作，请立即修改密码并联系管理员</li>
              <li>请勿将验证码透露给他人</li>
              <li>验证码仅用于本次密码重置</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>此邮件由系统自动发送，请勿直接回复</p>
          <p>&copy; ${new Date().getFullYear()} 物资管理系统 | Inventory Master</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;
