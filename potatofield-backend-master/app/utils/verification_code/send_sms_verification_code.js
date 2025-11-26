const tencentcloud = require('tencentcloud-sdk-nodejs');

const tcloudConfig = require('../../config/tcloud');

module.exports = ({
  phoneNumbers,
  phoneNumber,
  code,
  expiresIn,
}) => new Promise((resolve, reject) => {
  const SmsClient = tencentcloud.sms.v20210111.Client;
  const sms = new SmsClient({
    credential: {
      secretId: tcloudConfig.secretId,
      secretKey: tcloudConfig.secretKey,
    },
    region: 'ap-guangzhou',
    profile: {
      httpProfile: {
        endpoint: 'sms.tencentcloudapi.com',
      },
    },
  });
  sms.SendSms({
    PhoneNumberSet: phoneNumbers?.map((number) => (number.startsWith('+86') ? number : `+86${number}`)) || [phoneNumber.startsWith('+86') ? phoneNumber : `+86${phoneNumber}`],
    SmsSdkAppId: tcloudConfig.smsAppId,
    SignName: '洋芋田',
    TemplateId: tcloudConfig.smsTemplateId,
    TemplateParamSet: [code, expiresIn],
  }).then(() => {
    resolve();
  }, (err) => {
    reject(err);
  });
});
