import axios from 'axios';

/**
 * OAuth服务 - 处理微信和QQ的OAuth认证
 */

// 微信API配置
const WECHAT_API = {
  getUserAccessToken: 'https://api.weixin.qq.com/sns/oauth2/access_token',
  getUserInfo: 'https://api.weixin.qq.com/sns/userinfo',
};

// QQ API配置
const QQ_API = {
  getUserAccessToken: 'https://graph.qq.com/oauth2.0/token',
  getUnionId: 'https://graph.qq.com/oauth2.0/me',
  getUserInfo: 'https://graph.qq.com/user/get_user_info',
};

/**
 * 微信OAuth - 通过code获取用户信息
 */
export const getWechatUserInfo = async (code: string) => {
  try {
    const appid = process.env.WECHAT_WEBSITE_APPID;
    const secret = process.env.WECHAT_WEBSITE_SECRET;

    if (!appid || !secret) {
      throw new Error('微信配置未设置');
    }

    // 1. 获取access_token
    const accessTokenRes = await axios.get(
      `${WECHAT_API.getUserAccessToken}?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
    );

    if (accessTokenRes.status !== 200 || !accessTokenRes.data.access_token) {
      throw new Error('获取微信access_token失败');
    }

    const { access_token: accessToken, openid: openId } = accessTokenRes.data;

    // 2. 获取用户信息
    const userInfoRes = await axios.get(
      `${WECHAT_API.getUserInfo}?access_token=${accessToken}&openid=${openId}&lang=zh_CN`
    );

    if (userInfoRes.status !== 200) {
      throw new Error('获取微信用户信息失败');
    }

    const { unionid: unionId, nickname, headimgurl: avatar } = userInfoRes.data;

    return {
      accessToken,
      openId,
      unionId,
      nickname,
      avatar,
    };
  } catch (error) {
    console.error('微信OAuth错误:', error);
    throw error;
  }
};

/**
 * QQ OAuth - 通过code获取用户信息
 */
export const getQQUserInfo = async (code: string, redirectUri: string) => {
  try {
    const appid = process.env.QQ_WEBSITE_APPID;
    const secret = process.env.QQ_WEBSITE_SECRET;

    if (!appid || !secret) {
      throw new Error('QQ配置未设置');
    }

    // 1. 获取access_token
    const accessTokenRes = await axios.get(
      `${QQ_API.getUserAccessToken}?client_id=${appid}&client_secret=${secret}&code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code`
    );

    if (accessTokenRes.status !== 200) {
      throw new Error('获取QQ access_token失败');
    }

    // QQ返回的是 URL 参数格式，需要解析
    const accessToken = new URLSearchParams(accessTokenRes.data).get('access_token');
    if (!accessToken) {
      throw new Error('QQ access_token解析失败');
    }

    // 2. 获取openid和unionid
    const unionIdRes = await axios.get(
      `${QQ_API.getUnionId}?access_token=${accessToken}&fmt=json&unionid=1`
    );

    if (unionIdRes.status !== 200) {
      throw new Error('获取QQ unionId失败');
    }

    const { openid: openId, unionid: unionId } = unionIdRes.data;

    // 3. 获取用户信息
    const userInfoRes = await axios.get(
      `${QQ_API.getUserInfo}?access_token=${accessToken}&oauth_consumer_key=${appid}&openid=${openId}`
    );

    if (userInfoRes.status !== 200) {
      throw new Error('获取QQ用户信息失败');
    }

    const { nickname, figureurl_qq_2: avatar } = userInfoRes.data;

    return {
      accessToken,
      openId,
      unionId,
      nickname,
      avatar: avatar || userInfoRes.data.figureurl_qq_1 || userInfoRes.data.figureurl,
    };
  } catch (error) {
    console.error('QQ OAuth错误:', error);
    throw error;
  }
};

/**
 * 下载并处理用户头像
 */
export const downloadAvatar = async (avatarUrl: string): Promise<Buffer> => {
  try {
    const response = await axios.get(avatarUrl, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('下载头像失败:', error);
    throw new Error('下载头像失败');
  }
};
