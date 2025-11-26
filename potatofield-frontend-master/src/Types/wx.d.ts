interface WechatConfigProps {
  debug?: boolean;
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
  jsApiList: string[];
}

interface UpdateAppMessageShareDataProps {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
}

interface UpdateTimelineShareDataProps {
  title: string;
  link: string;
  imgUrl: string;
}

interface WechatObject {
  config: (props: WechatConfigProps) => void;
  ready: (callback: () => void) => void;
  updateAppMessageShareData: (props: UpdateAppMessageShareDataProps) => void;
  updateTimelineShareData: (props: UpdateTimelineShareDataProps) => void;
}
