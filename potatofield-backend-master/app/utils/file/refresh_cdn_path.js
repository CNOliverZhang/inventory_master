const tencentcloud = require('tencentcloud-sdk-nodejs');

const tcloudConfig = require('../../config/tcloud');

module.exports = ({ paths, path }) => new Promise((resolve, reject) => {
  const CdnClient = tencentcloud.cdn.v20180606.Client;
  const cdn = new CdnClient({
    credential: {
      SecretId: tcloudConfig.secretId,
      SecretKey: tcloudConfig.secretKey,
    },
    region: '',
    profile: {
      httpProfile: {
        endpoint: 'cdn.tencentcloudapi.com',
      },
    },
  });
  cdn.PurgePathCache({
    Paths: paths || [path],
  }).then(() => {
    resolve();
  }, () => {
    reject();
  });
});
