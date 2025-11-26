export default {
  common: {
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    yes: '是',
    no: '否',
    optional: '可选',
    actions: '操作',
    operationFailed: '操作失败',
  },
  
  nav: {
    allMaterials: '全部物资',
    miscMaterials: '杂物',
    clothing: '衣物',
    collectible: '收藏品',
    categories: '分类管理',
    logout: '退出登录',
  },

  auth: {
    login: '登录',
    register: '注册',
    username: '用户名',
    email: '邮箱',
    phone: '手机号',
    password: '密码',
    confirmPassword: '确认密码',
    verificationCode: '验证码',
    welcomeBack: '欢迎回来',
    createAccount: '创建新账户',
    appTitle: '洋芋田收纳大师',
    loginBtn: '登录',
    registerBtn: '注册',
    verifyAndCompleteBtn: '验证邮箱并完成注册',
    resendCodeBtn: '重发验证码',
    registerMethod: '注册方式',
    emailRegister: '邮箱注册',
    phoneRegister: '手机号注册',
    
    // 新增字段
    emailOrUsername: '邮箱/用户名/手机号',
    enterEmailOrUsername: '请输入邮箱、用户名或手机号',
    emailOrPhone: '邮箱/手机号',
    enterEmailOrPhone: '请输入邮箱或手机号',
    graphicCaptcha: '图形验证码',
    enterCaptcha: '请输入验证码',
    sendCode: '发送验证码',
    completeRegistration: '完成注册',
    resendAfter: '重新发送',
    resendCode: '重新发送验证码',
    orLoginWith: '或使用以下方式登录',
    orRegisterWith: '或使用以下方式注册',
    wechat: '微信',
    qq: 'QQ',
    
    // 占位符
    enterUsername: '请输入用户名（3-50个字符）',
    enterEmail: '请输入邮箱',
    enterPhone: '请输入手机号',
    enterPassword: '请输入密码（至少6位）',
    reEnterPassword: '请再次输入密码',
    enterVerificationCode: '请输入6位验证码',
    
    // 验证消息
    usernameRequired: '请输入用户名',
    usernameLength: '用户名长度为 3-50 个字符',
    emailRequired: '请输入邮箱',
    emailInvalid: '请输入正确的邮箱格式',
    phoneRequired: '请输入手机号',
    phoneInvalid: '请输入正确的手机号格式',
    passwordRequired: '请输入密码',
    passwordLength: '密码长度至少为 6 位',
    confirmPasswordRequired: '请再次输入密码',
    passwordMismatch: '两次输入密码不一致',
    verificationCodeRequired: '请输入验证码',
    verificationCodeInvalid: '验证码格式不正确（6位数字）',
    
    // 验证码相关
    codeSentSuccess: '验证码已发送',
    codeSentHint: '验证码已发送，请查收（有效期5分钟）',
    codeResendHint: '验证码已重新发送',
    codeExpired: '验证码已过期，请重新发送',
    codeInvalid: '验证码错误',
    sendingCode: '发送中...',
    waitBeforeResend: '请等待 {seconds} 秒后再重新发送',
    
    // 响应消息
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    sendCodeSuccess: '验证码已发送',
    sendCodeFailed: '发送验证码失败',
    getCaptchaFailed: '获取验证码失败',
    logoutSuccess: '已退出登录',
    logoutConfirm: '确定要退出登录吗？',
    
    // OAuth相关
    oauthNeedBind: '该账号尚未绑定，请绑定已有账号或注册新账号',
    oauthLoginSuccess: '第三方登录成功',
    oauthLoginFailed: '第三方登录失败',
    oauthBindSuccess: '绑定成功',
    oauthBindFailed: '绑定失败',
    bindExistingAccount: '绑定已有账号',
    registerNewAccount: '注册新账号',
    chooseAction: '选择操作',
    oauthNotBoundHint: '该第三方账号尚未绑定本站账号',
    bindExistingAccountHint: '使用已有账号密码登录并绑定',
    registerNewAccountHint: '使用该第三方账号注册新用户',
    bindAndLogin: '绑定并登录',
  },

  material: {
    // 类型
    misc: '杂物',
    clothing: '衣物',
    collectible: '收藏品',
    
    // 字段
    name: '物资名称',
    type: '物资类型',
    category: '细分类别',
    location: '存放位置',
    photo: '照片',
    quantity: '总数量',
    inUseQuantity: '在用数量',
    stockQuantity: '库存数量',
    description: '详细信息',
    
    // 操作
    addMaterial: '添加物资',
    editMaterial: '编辑物资',
    deleteMaterial: '删除物资',
    viewDetail: '查看详情',
    quickActions: '快捷操作',
    
    // 快捷操作
    restock: '补充库存',
    'take-out': '领用',
    discard: '报废',
    replace: '替换',
    restockAmount: '补充数量',
    enterAmount: '请输入补充数量',
    restockPrompt: '请输入补充数量',
    invalidAmount: '请输入有效的数量',
    
    // 占位符
    enterName: '请输入物资名称',
    selectType: '请选择物资类型',
    selectCategory: '请选择细分类别（可选）',
    enterLocation: '请输入存放位置',
    searchPlaceholder: '搜索物资名称...',
    enterDescription: '请输入详细信息（可选）',
    
    // 上传
    uploadPhoto: '点击或拖拽上传照片',
    uploadHint: '支持 JPG、PNG 格式，最大 5MB',
    changePhoto: '更换照片',
    removePhoto: '删除照片',
    
    // 验证
    nameRequired: '缺少必填字段：name, type, location',
    typeInvalid: '无效的物资类型',
    
    // 响应消息
    createSuccess: '物资创建成功',
    updateSuccess: '物资更新成功',
    deleteSuccess: '物资删除成功',
    deleteConfirm: '确定要删除物资"{name}"吗？',
    restockSuccess: '补充库存成功',
    'take-outSuccess': '领用成功',
    discardSuccess: '报废成功',
    replaceSuccess: '替换成功',
    
    // 状态
    noData: '暂无物资数据',
    addFirst: '快来添加第一个物资吧',
    notFound: '物资不存在或无权访问',
    noCategory: '无分类',
  },

  category: {
    // 字段
    name: '类别名称',
    type: '所属类型',
    materialCount: '物资数量',
    title: '类别',
    
    // 操作
    addCategory: '添加类别',
    editCategory: '编辑类别',
    deleteCategory: '删除类别',
    manage: '分类管理',
    
    // 占位符
    enterName: '请输入类别名称',
    selectType: '请选择所属类型',
    
    // 验证
    nameRequired: '请输入类别名称',
    typeRequired: '请选择所属类型',
    duplicateName: '该类型下已存在同名类别',
    
    // 响应消息
    createSuccess: '类别创建成功',
    updateSuccess: '类别更新成功',
    deleteSuccess: '类别删除成功',
    deleteConfirm: '确定要删除类别"{name}"吗？',
    deleteWarning: '无法删除：还有 {count} 个物资使用该类别',
    
    // 状态
    noData: '暂无分类',
    notFound: '类别不存在',
  },

  statistics: {
    title: '统计概览',
    total: '总物资',
    misc: '杂物',
    clothing: '衣物',
    collectible: '收藏品',
  },

  error: {
    networkError: '网络错误，请稍后重试',
    serverError: '服务器错误',
    unauthorized: '未认证，请重新登录',
    forbidden: '无权访问',
    notFound: '资源不存在',
    requestFailed: '请求失败',
  },

  settings: {
    title: '个人设置',
    theme: {
      title: '主题颜色',
      changed: '主题已切换',
    },
    darkMode: {
      title: '深色模式',
      light: '保持浅色',
      dark: '保持深色',
      system: '跟随系统',
      changed: '深色模式已更新',
    },
    account: {
      title: '账户设置',
      username: '用户名',
      email: '邮箱',
      password: '密码',
      changeEmail: '修改邮箱',
      changePassword: '修改密码',
      oldPassword: '原密码',
      newPassword: '新密码',
      confirmPassword: '确认密码',
      newEmail: '新邮箱',
      fillAllFields: '请填写所有字段',
      passwordMismatch: '两次输入的密码不一致',
      passwordTooShort: '密码长度至少为 6 位',
      invalidEmail: '请输入正确的邮箱格式',
      passwordChanged: '密码修改成功',
      emailChanged: '邮箱修改成功',
    },
  },
}
