import * as tencentcloud from 'tencentcloud-sdk-nodejs';

// 腾讯云短信配置
const SMS_SDK_APP_ID = process.env.SMS_SDK_APP_ID || '';
const SMS_SECRET_ID = process.env.SMS_SECRET_ID || process.env.COS_SECRET_ID || '';
const SMS_SECRET_KEY = process.env.SMS_SECRET_KEY || process.env.COS_SECRET_KEY || '';
const SMS_SIGN_NAME = process.env.SMS_SIGN_NAME || '深圳市洋芋田信息技术';
const SMS_TEMPLATE_ID = process.env.SMS_TEMPLATE_ID || '';

/**
 * 发送短信验证码
 * @param phone 手机号
 * @param code 验证码
 * @param expiresIn 过期时间（分钟）
 */
export const sendSMS = async (
  phone: string,
  code: string,
  expiresIn: number = 5
): Promise<void> => {
  try {
    // 检查配置是否完整
    if (!SMS_SDK_APP_ID || !SMS_SECRET_ID || !SMS_SECRET_KEY || !SMS_TEMPLATE_ID) {
      console.warn('短信服务配置不完整，仅记录日志');
      console.log(`[SMS] 发送验证码到手机 ${phone}: ${code}，有效期 ${expiresIn} 分钟`);
      return;
    }

    const SmsClient = tencentcloud.sms.v20210111.Client;
    
    const client = new SmsClient({
      credential: {
        secretId: SMS_SECRET_ID,
        secretKey: SMS_SECRET_KEY,
      },
      region: 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: 'sms.tencentcloudapi.com',
        },
      },
    });

    // 确保手机号带有+86前缀
    const phoneNumber = phone.startsWith('+86') ? phone : `+86${phone}`;

    const params = {
      PhoneNumberSet: [phoneNumber],
      SmsSdkAppId: SMS_SDK_APP_ID,
      SignName: SMS_SIGN_NAME,
      TemplateId: SMS_TEMPLATE_ID,
      TemplateParamSet: [code, expiresIn.toString()],
    };

    await client.SendSms(params);
    console.log(`[SMS] 短信发送成功: ${phone}`);
  } catch (error) {
    console.error('[SMS] 短信发送失败:', error);
    throw new Error('短信发送失败');
  }
};
