const nodemailer = require('nodemailer');

const smtpConfig = require('../../config/smtp');
const { websiteUrl } = require('../../apis/baseUrl');

module.exports = ({ email, code, expiresIn }) => new Promise((resolve, reject) => {
  const transporter = nodemailer.createTransport(smtpConfig);
  transporter.sendMail({
    from: `洋芋田 ${smtpConfig.auth.user}`,
    to: email,
    subject: '洋芋田邮箱验证',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="font-size: 32px; margin-bottom: 50px;">
          邮箱验证
        </div>
        <div style="color: #888;">
          Hi，您的洋芋田网站邮箱验证码为：
        </div>
        <div style="padding: 20px; background-color: #2196F3; color: #FFF; font-size: 32px; margin-bottom: 40px; margin-top: 40px;">
          ${code}
        </div>
        <div style="color: #888;">
          验证码有效期为${expiresIn}分钟，请您在有效期内完成邮箱验证。
        </div>
        <hr style="height: 1px; width: 100%; background-color: #DDD; border: none; margin-bottom: 20px; margin-top: 20px;" />
        <a href="${websiteUrl}" target="_blank" style=" color: #888;">
          洋芋田
        </a>
      </div>
    `,
  }).then(() => {
    resolve();
  }, (err) => {
    reject(err);
  });
});
