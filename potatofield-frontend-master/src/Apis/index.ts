import { apiUrl } from '@/Apis/baseUrl';

export default {
  user: {
    profile: {
      get: `${apiUrl}/user/profile/detail`,
      update: `${apiUrl}/user/profile/update`,
      uploadAvatar: `${apiUrl}/user/profile/upload_avatar`,
    },
  },
  auth: {
    user: {
      login: `${apiUrl}/auth/user/login`,
      register: `${apiUrl}/auth/user/register`,
    },
    credential: {
      list: `${apiUrl}/auth/credential/list`,
      add: `${apiUrl}/auth/credential/add`,
      update: `${apiUrl}/auth/credential/update`,
      remove: `${apiUrl}/auth/credential/remove`,
      changePassword: `${apiUrl}/auth/credential/change_password`,
    },
    verify: {
      phone: `${apiUrl}/auth/verify/phone`,
      email: `${apiUrl}/auth/verify/email`,
    },
    wechat: {
      login: `${apiUrl}/auth/wechat/login`,
      register: `${apiUrl}/auth/wechat/register`,
      connect: `${apiUrl}/auth/wechat/connect`,
      loginAndConnect: `${apiUrl}/auth/wechat/login_and_connect`,
    },
    qq: {
      login: `${apiUrl}/auth/qq/login`,
      register: `${apiUrl}/auth/qq/register`,
      connect: `${apiUrl}/auth/qq/connect`,
      loginAndConnect: `${apiUrl}/auth/qq/login_and_connect`,
    },
    wechatLogin: `${apiUrl}/auth/user/wechat_login`,
    wechatLoginGetCode: 'https://open.weixin.qq.com/connect/qrconnect?response_type=code&scope=snsapi_login',
    qqLogin: `${apiUrl}/auth/user/qq_login`,
    qqLoginGetCode: 'https://graph.qq.com/oauth2.0/authorize?response_type=code',
  },
  fontLibrary: {
    font: {
      add: `${apiUrl}/font_library/font/add`,
      update: `${apiUrl}/font_library/font/update`,
      remove: `${apiUrl}/font_library/font/remove`,
    },
    fontFamily: {
      add: `${apiUrl}/font_library/font_family/add`,
      list: `${apiUrl}/font_library/font_family/list`,
      update: `${apiUrl}/font_library/font_family/update`,
      remove: `${apiUrl}/font_library/font_family/remove`,
    },
    fontStyle: {
      list: `${apiUrl}/font_library/font_style/list`,
    },
  },
  imageToolkit: {
    tool: {
      list: `${apiUrl}/image_toolkit/tool/list`,
      add: `${apiUrl}/image_toolkit/tool/add`,
      update: `${apiUrl}/image_toolkit/tool/update`,
      remove: `${apiUrl}/image_toolkit/tool/remove`,
    },
    version: {
      add: `${apiUrl}/image_toolkit/version/add`,
      list: `${apiUrl}/image_toolkit/version/list`,
      latest: `${apiUrl}/image_toolkit/version/latest`,
    },
    message: {
      list: `${apiUrl}/image_toolkit/message/list`,
      add: `${apiUrl}/image_toolkit/message/add`,
      update: `${apiUrl}/image_toolkit/message/update`,
      remove: `${apiUrl}/image_toolkit/message/remove`,
    },
    client: {
      countNew: `${apiUrl}/image_toolkit/client/count_new`,
      countActive: `${apiUrl}/image_toolkit/client/count_active`,
      count: `${apiUrl}/image_toolkit/client/count`,
    },
  },
  richTextEditor: {
    version: {
      add: `${apiUrl}/rich_text_editor/version/add`,
      list: `${apiUrl}/rich_text_editor/version/list`,
      latest: `${apiUrl}/rich_text_editor/version/latest`,
    },
    client: {
      countNew: `${apiUrl}/rich_text_editor/client/count_new`,
      countActive: `${apiUrl}/rich_text_editor/client/count_active`,
      count: `${apiUrl}/rich_text_editor/client/count`,
    },
  },
  imageNotebook: {
    version: {
      add: `${apiUrl}/image_notebook/version/add`,
      list: `${apiUrl}/image_notebook/version/list`,
      latest: `${apiUrl}/image_notebook/version/latest`,
    },
    client: {
      countNew: `${apiUrl}/image_notebook/client/count_new`,
      countActive: `${apiUrl}/image_notebook/client/count_active`,
      count: `${apiUrl}/image_notebook/client/count`,
    },
  },
  mediaCenter: {
    file: {
      get: `${apiUrl}/media_center/file/detail`,
      list: `${apiUrl}/media_center/file/list`,
      add: `${apiUrl}/media_center/file/add`,
      update: `${apiUrl}/media_center/file/update`,
      remove: `${apiUrl}/media_center/file/remove`,
      addTag: `${apiUrl}/media_center/file/add_tag`,
      removeTag: `${apiUrl}/media_center/file/remove_tag`,
      clearTags: `${apiUrl}/media_center/file/clear_tags`,
    },
    tag: {
      list: `${apiUrl}/media_center/tag/list`,
      add: `${apiUrl}/media_center/tag/add`,
      remove: `${apiUrl}/media_center/tag/remove`,
    },
  },
  blog: {
    category: {
      list: `${apiUrl}/blog/category/list`,
      add: `${apiUrl}/blog/category/add`,
      update: `${apiUrl}/blog/category/update`,
      remove: `${apiUrl}/blog/category/remove`,
      getTree: `${apiUrl}/blog/category/get_tree`,
    },
    tag: {
      list: `${apiUrl}/blog/tag/list`,
      add: `${apiUrl}/blog/tag/add`,
      remove: `${apiUrl}/blog/tag/remove`,
    },
    article: {
      detail: `${apiUrl}/blog/article/detail`,
      list: `${apiUrl}/blog/article/list`,
      add: `${apiUrl}/blog/article/add`,
      update: `${apiUrl}/blog/article/update`,
      remove: `${apiUrl}/blog/article/remove`,
      addTag: `${apiUrl}/blog/article/add_tag`,
      getTags: `${apiUrl}/blog/article/get_tags`,
      removeTag: `${apiUrl}/blog/article/remove_tag`,
      clearTags: `${apiUrl}/blog/article/clear_tags`,
      exportToWechat: `${apiUrl}/blog/article/export_to_wechat`,
    },
  },
  service: {
    wechat: {
      getJsSdkSignature: `${apiUrl}/service/wechat/get_js_sdk_signature`,
    },
  },
};
