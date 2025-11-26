const fs = require('fs');
const Cos = require('cos-nodejs-sdk-v5');

const tcloudConfig = require('../../config/tcloud');

module.exports = ({ file, buffer, key }) => new Promise((resolve, reject) => {
  const cos = new Cos({
    SecretId: tcloudConfig.secretId,
    SecretKey: tcloudConfig.secretKey,
  });
  cos.putObject({
    Bucket: tcloudConfig.cosBucket,
    Region: tcloudConfig.cosRegion,
    Key: key,
    Body: buffer || fs.createReadStream(file.path),
  }, (err) => {
    if (!err) {
      resolve(`${tcloudConfig.cosBaseUrl}${key}`);
    } else {
      reject(err);
    }
  });
});
