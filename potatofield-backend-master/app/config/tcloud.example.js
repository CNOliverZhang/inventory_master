const isDev = process.env.NODE_ENV === 'development';

const productionCos = {
  cosBucket: '存储桶名称',
  cosRegion: '存储桶区域',
  cosBaseUrl: '存储桶网址',
};

const developmentCos = {
  cosBucket: '存储桶名称',
  cosRegion: '存储桶区域',
  cosBaseUrl: '存储桶网址',
};

module.exports = {
  secretId: '访问id',
  secretKey: '访问密钥',
  smsAppId: '短信应用ID',
  smsTemplateId: '短信模板ID',
  ...(isDev ? developmentCos : productionCos),
};
