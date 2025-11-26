const Cos = require('cos-nodejs-sdk-v5');

const tcloudConfig = require('../../config/tcloud');

module.exports = ({ keys, urls }) => new Promise((resolve, reject) => {
  const cos = new Cos({
    SecretId: tcloudConfig.secretId,
    SecretKey: tcloudConfig.secretKey,
  });
  cos.deleteMultipleObject({
    Bucket: tcloudConfig.cosBucket,
    Region: tcloudConfig.cosRegion,
    Objects: keys?.map((key) => ({ Key: key })) || urls.map((url) => ({ Key: url.replace(tcloudConfig.cosBaseUrl, '') })),
  }, (err, data) => {
    if (!err) {
      resolve(data);
    } else {
      reject(err);
    }
  });
});
