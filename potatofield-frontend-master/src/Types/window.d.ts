interface Window {
  vaptcha: (props: VaptchaProps) => Promise<VaptchaObject>;
  vaptchaObject: VaptchaObject;
  wx: WechatObject;
}
