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
  },
  
  nav: {
    allMaterials: '全部物资',
    studioMaterials: '工作室物料',
    clothing: '衣物',
    misc: '杂物',
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
    appTitle: '物资管理系统',
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
    studio: '工作室物料',
    clothing: '衣物',
    misc: '杂物',
    
    // 字段
    name: '物资名称',
    type: '物资类型',
    category: '细分类别',
    location: '存放位置',
    photo: '照片',
    quantity: '数量',
    inUseQuantity: '在用数量',
    stockQuantity: '库存数量',
    
    // 操作
    addMaterial: '添加物资',
    editMaterial: '编辑物资',
    deleteMaterial: '删除物资',
    viewDetail: '查看详情',
    
    // 占位符
    enterName: '请输入物资名称',
    selectType: '请选择物资类型',
    selectCategory: '请选择细分类别（可选）',
    enterLocation: '请输入存放位置',
    searchPlaceholder: '搜索物资名称...',
    
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
    studio: '工作室',
    clothing: '衣物',
    misc: '杂物',
  },

  error: {
    networkError: '网络错误，请稍后重试',
    serverError: '服务器错误',
    unauthorized: '未认证，请重新登录',
    forbidden: '无权访问',
    notFound: '资源不存在',
    requestFailed: '请求失败',
  },
}
