declare module 'svg-captcha' {
  export interface ConfigObject {
    size?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    charPreset?: string;
    color?: boolean;
    background?: string;
    noise?: number;
    ignoreChars?: string;
  }

  export interface CaptchaObj {
    data: string;
    text: string;
  }

  export function create(options?: ConfigObject): CaptchaObj;
  export function createMathExpr(options?: ConfigObject): CaptchaObj;
  
  export function loadFont(url: string): void;
  export function randomText(size?: number, ignoreChars?: string): string;
  
  const svgCaptcha: {
    create: typeof create;
    createMathExpr: typeof createMathExpr;
    loadFont: typeof loadFont;
    randomText: typeof randomText;
  };
  
  export default svgCaptcha;
}
