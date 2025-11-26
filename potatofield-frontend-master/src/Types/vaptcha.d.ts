interface VaptchaProps {
  vid: string;
  type: 'invisible' | 'click' | 'embeded';
  scene?: number;
  lang?: 'auto' | 'zh-CN' | 'en' | 'zh-TW' | 'jp';
  https?: boolean;
  area?: 'auto' | 'sea' | 'na' | 'cn';
}

interface VaptchaServerToken {
  server: string;
  token: string;
}

interface VaptchaObject {
  listen: (event: 'close' | 'pass', callback: () => void) => void;
  validate: () => void;
  getServerToken: () => VaptchaServerToken;
}
