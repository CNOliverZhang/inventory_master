module.exports = {
  wechat: {
    miniProgram: {
      getUnionId: 'https://api.weixin.qq.com/sns/jscode2session',
    },
    getUserAccessToken: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    getUserInfo: 'https://api.weixin.qq.com/sns/userinfo',
    getAccessToken: 'https://api.weixin.qq.com/cgi-bin/token',
    getJsApiTicket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    uploadImage: 'https://api.weixin.qq.com/cgi-bin/media/uploadimg',
    uploadMedia: 'https://api.weixin.qq.com/cgi-bin/material/add_material',
    addArticle: 'https://api.weixin.qq.com/cgi-bin/draft/add',
  },
  qq: {
    getUserAccessToken: 'https://graph.qq.com/oauth2.0/token',
    getUnionId: 'https://graph.qq.com/oauth2.0/me',
    getUserInfo: 'https://graph.qq.com/user/get_user_info',
  },
};
