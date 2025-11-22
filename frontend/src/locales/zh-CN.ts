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
    operationFailed: '操作失败',
  },
  
  nav: {
    allMaterials: '全部物资',
    studioMaterials: '杂物',
    clothing: '衣物',
    misc: '收藏品',
    categories: '分类管理',
    logout: '退出登录',
  },

  auth: {
    login: '登录',
    register: '注册',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    welcomeBack: '欢迎回来',
    createAccount: '创建新账户',
    appTitle: '洋芋田收纳大师',
    loginBtn: '登录',
    registerBtn: '注册',
    
    // 占位符
    enterUsername: '请输入用户名（3-50个字符）',
    enterEmail: '请输入邮箱',
    enterPassword: '请输入密码（至少6位）',
    reEnterPassword: '请再次输入密码',
    
    // 验证消息
    usernameRequired: '请输入用户名',
    usernameLength: '用户名长度为 3-50 个字符',
    emailRequired: '请输入邮箱',
    emailInvalid: '请输入正确的邮箱格式',
    passwordRequired: '请输入密码',
    passwordLength: '密码长度至少为 6 位',
    confirmPasswordRequired: '请再次输入密码',
    passwordMismatch: '两次输入密码不一致',
    
    // 响应消息
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    logoutSuccess: '已退出登录',
    logoutConfirm: '确定要退出登录吗？',
  },

  material: {
    // 类型
    studio: '杂物',
    clothing: '衣物',
    misc: '收藏品',
    
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
    studio: '杂物',
    clothing: '衣物',
    misc: '收藏品',
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
