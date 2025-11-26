export enum AUTH_TYPE {
  USERNAME = 1,
  PHONE = 2,
  EMAIL = 3,
  WECHAT = 4,
  QQ = 5,
}

export const AUTH_TYPE_NAME = {
  [AUTH_TYPE.USERNAME]: '用户名',
  [AUTH_TYPE.PHONE]: '手机号',
  [AUTH_TYPE.EMAIL]: '电子邮箱',
  [AUTH_TYPE.WECHAT]: '微信',
  [AUTH_TYPE.QQ]: 'QQ',
};
