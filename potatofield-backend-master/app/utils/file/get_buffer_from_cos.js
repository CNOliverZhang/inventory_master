const Cos = require('cos-nodejs-sdk-v5');

const tcloudConfig = require('../../config/tcloud');

module.exports = ({ key, url }) => new Promise((resolve, reject) => {
  const cos = new Cos({
    SecretId: tcloudConfig.secretId,
    SecretKey: tcloudConfig.secretKey,
  });
  cos.getObject({
    Bucket: tcloudConfig.cosBucket,
    Region: tcloudConfig.cosRegion,
    Key: key || url.replace(tcloudConfig.cosBaseUrl, ''),
  }, (err, data) => {
    if (!err) {
      resolve(data.Body);
    } else {
      reject(err);
    }
  });
});
