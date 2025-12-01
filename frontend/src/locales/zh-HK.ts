export default {
  common: {
    confirm: '確定',
    cancel: '取消',
    save: '儲存',
    delete: '刪除',
    edit: '編輯',
    add: '新增',
    search: '搜尋',
    loading: '載入中...',
    success: '成功',
    error: '錯誤',
    warning: '警告',
    info: '資訊',
    yes: '是',
    no: '否',
    optional: '可選',
    actions: '操作',
    operationFailed: '操作失敗',
  },
  
  nav: {
    allMaterials: '全部物資',
    miscMaterials: '雜物',
    clothing: '衣物',
    collectible: '收藏品',
    categories: '分類管理',
    logout: '登出',
  },

  auth: {
    login: '登入',
    register: '註冊',
    username: '用戶名稱',
    email: '電郵',
    phone: '手機號碼',
    password: '密碼',
    confirmPassword: '確認密碼',
    verificationCode: '驗證碼',
    welcomeBack: '歡迎回來',
    createAccount: '建立新帳戶',
    appTitle: '洋芋田收納大師',
    loginBtn: '登入',
    registerBtn: '註冊',
    verifyAndCompleteBtn: '驗證電郵並完成註冊',
    resendCodeBtn: '重發驗證碼',
    registerMethod: '註冊方式',
    emailRegister: '電郵註冊',
    phoneRegister: '手機號碼註冊',
    
    // 新增字段
    emailOrUsername: '電郵/用戶名稱/手機號碼',
    enterEmailOrUsername: '請輸入電郵、用戶名稱或手機號碼',
    emailOrPhone: '電郵/手機號碼',
    enterEmailOrPhone: '請輸入電郵或手機號碼',
    graphicCaptcha: '圖形驗證碼',
    enterCaptcha: '請輸入驗證碼',
    sendCode: '發送驗證碼',
    completeRegistration: '完成註冊',
    resendAfter: '重新發送',
    resendCode: '重新發送驗證碼',
    orLoginWith: '或使用以下方式登入',
    orRegisterWith: '或使用以下方式註冊',
    wechat: '微信',
    qq: 'QQ',
    
    // 占位符
    enterUsername: '請輸入用戶名稱（3-50個字元）',
    enterEmail: '請輸入電郵',
    enterPhone: '請輸入手機號碼',
    enterPassword: '請輸入密碼（至少6位）',
    reEnterPassword: '請再次輸入密碼',
    enterVerificationCode: '請輸入6位驗證碼',
    
    // 驗證消息
    usernameRequired: '請輸入用戶名稱',
    usernameLength: '用戶名稱長度為 3-50 個字元',
    emailRequired: '請輸入電郵',
    emailInvalid: '請輸入正確的電郵格式',
    phoneRequired: '請輸入手機號碼',
    phoneInvalid: '請輸入正確的手機號碼格式',
    passwordRequired: '請輸入密碼',
    passwordLength: '密碼長度至少為 6 位',
    confirmPasswordRequired: '請再次輸入密碼',
    passwordMismatch: '兩次輸入密碼不一致',
    verificationCodeRequired: '請輸入驗證碼',
    verificationCodeInvalid: '驗證碼格式不正確（6位數字）',
    
    // 驗證碼相關
    codeSentSuccess: '驗證碼已發送',
    codeSentHint: '驗證碼已發送，請查收（有效期5分鐘）',
    codeResendHint: '驗證碼已重新發送',
    codeExpired: '驗證碼已過期，請重新發送',
    codeInvalid: '驗證碼錯誤',
    sendingCode: '發送中...',
    waitBeforeResend: '請等待 {seconds} 秒後再重新發送',
    
    // 響應消息
    loginSuccess: '登入成功',
    loginFailed: '登入失敗',
    registerSuccess: '註冊成功',
    registerFailed: '註冊失敗',
    sendCodeSuccess: '驗證碼已發送',
    sendCodeFailed: '發送驗證碼失敗',
    getCaptchaFailed: '獲取驗證碼失敗',
    logoutSuccess: '已登出',
    logoutConfirm: '確定要登出嗎？',
    
    // OAuth相關
    oauthNeedBind: '該帳號尚未綁定，請綁定已有帳號或註冊新帳號',
    oauthLoginSuccess: '第三方登入成功',
    oauthLoginFailed: '第三方登入失敗',
    oauthBindSuccess: '綁定成功',
    oauthBindFailed: '綁定失敗',
    bindExistingAccount: '綁定已有帳號',
    registerNewAccount: '註冊新帳號',
    chooseAction: '選擇操作',
    oauthNotBoundHint: '該第三方帳號尚未綁定本站帳號',
    bindExistingAccountHint: '使用已有帳號密碼登入並綁定',
    registerNewAccountHint: '使用該第三方帳號註冊新用戶',
    bindAndLogin: '綁定並登入',
  },

  material: {
    // 類型
    misc: '雜物',
    clothing: '衣物',
    collectible: '收藏品',
    
    // 字段
    name: '物資名稱',
    type: '物資類型',
    category: '細分類別',
    location: '存放位置',
    photo: '相片',
    quantity: '總數量',
    inUseQuantity: '在用數量',
    stockQuantity: '庫存數量',
    description: '詳細資訊',
    
    // 操作
    addMaterial: '新增物資',
    editMaterial: '編輯物資',
    deleteMaterial: '刪除物資',
    viewDetail: '查看詳情',
    quickActions: '快捷操作',
    
    // 快捷操作
    restock: '補充庫存',
    'take-out': '領用',
    discard: '報廢',
    replace: '替換',
    restockAmount: '補充數量',
    enterAmount: '請輸入補充數量',
    restockPrompt: '請輸入補充數量',
    invalidAmount: '請輸入有效的數量',
    
    // 占位符
    enterName: '請輸入物資名稱',
    selectType: '請選擇物資類型',
    selectCategory: '請選擇細分類別（可選）',
    enterLocation: '請輸入存放位置',
    searchPlaceholder: '搜尋物資名稱...',
    enterDescription: '請輸入詳細資訊（可選）',
    
    // 上傳
    uploadPhoto: '點擊或拖曳上傳相片',
    uploadHint: '支援 JPG、PNG 格式，最大 5MB',
    changePhoto: '更換相片',
    removePhoto: '刪除相片',
    
    // 驗證
    nameRequired: '缺少必填欄位：name, type, location',
    typeInvalid: '無效的物資類型',
    
    // 響應消息
    createSuccess: '物資建立成功',
    updateSuccess: '物資更新成功',
    deleteSuccess: '物資刪除成功',
    deleteConfirm: '確定要刪除物資「{name}」嗎？',
    restockSuccess: '補充庫存成功',
    'take-outSuccess': '領用成功',
    discardSuccess: '報廢成功',
    replaceSuccess: '替換成功',
    
    // 狀態
    noData: '暫無物資資料',
    addFirst: '快來新增第一個物資吧',
    notFound: '物資不存在或無權訪問',
    noCategory: '無分類',
  },

  category: {
    // 字段
    name: '類別名稱',
    type: '所屬類型',
    materialCount: '物資數量',
    title: '類別',
    
    // 操作
    addCategory: '新增類別',
    editCategory: '編輯類別',
    deleteCategory: '刪除類別',
    manage: '分類管理',
    
    // 占位符
    enterName: '請輸入類別名稱',
    selectType: '請選擇所屬類型',
    
    // 驗證
    nameRequired: '請輸入類別名稱',
    typeRequired: '請選擇所屬類型',
    duplicateName: '該類型下已存在同名類別',
    
    // 響應消息
    createSuccess: '類別建立成功',
    updateSuccess: '類別更新成功',
    deleteSuccess: '類別刪除成功',
    deleteConfirm: '確定要刪除類別「{name}」嗎？',
    deleteWarning: '無法刪除：還有 {count} 個物資使用該類別',
    
    // 狀態
    noData: '暫無分類',
    notFound: '類別不存在',
  },

  statistics: {
    title: '統計概覽',
    total: '總物資',
    misc: '雜物',
    clothing: '衣物',
    collectible: '收藏品',
  },

  error: {
    networkError: '網絡錯誤，請稍後重試',
    serverError: '伺服器錯誤',
    unauthorized: '未認證，請重新登入',
    forbidden: '無權訪問',
    notFound: '資源不存在',
    requestFailed: '請求失敗',
  },

  settings: {
    title: '個人設定',
    theme: {
      title: '主題顏色',
      changed: '主題已切換',
    },
    darkMode: {
      title: '深色模式',
      light: '保持淺色',
      dark: '保持深色',
      system: '跟隨系統',
      changed: '深色模式已更新',
    },
    account: {
      title: '帳戶設定',
      avatar: '頭像',
      avatarHint: '支援JPG、PNG格式，最大5MB',
      upload: '上傳',
      invalidImageType: '請上傳圖片格式檔案',
      imageTooLarge: '圖片大小不能超過5MB',
      avatarUploadSuccess: '頭像上傳成功',
      avatarDeleteSuccess: '頭像刪除成功',
      confirmDeleteAvatar: '確定要刪除頭像嗎？',
      nickname: '暱稱',
      username: '用戶名稱',
      email: '電郵',
      phone: '手機號碼',
      password: '密碼',
      changeEmail: '修改電郵',
      changePassword: '修改密碼',
      setPassword: '設定密碼',
      oldPassword: '原密碼',
      newPassword: '新密碼',
      confirmPassword: '確認密碼',
      newEmail: '新電郵',
      fillAllFields: '請填寫所有欄位',
      passwordMismatch: '兩次輸入的密碼不一致',
      passwordTooShort: '密碼長度至少為 6 位',
      invalidEmail: '請輸入正確的電郵格式',
      passwordChanged: '密碼修改成功',
      passwordSet: '密碼設定成功',
      emailChanged: '電郵修改成功',
      
      bindAccountFirst: '請先綁定手機號碼、電郵或用戶名稱後再設定密碼',
      
      // 綁定管理
      notSet: '未設定',
      notBound: '未綁定',
      bound: '已綁定',
      bind: '綁定',
      unbind: '解除綁定',
      rebind: '換綁',
      
      // 編輯對話框
      editNickname: '修改暱稱',
      editUsername: '修改用戶名稱',
      bindUsername: '綁定用戶名稱',
      bindEmail: '綁定電郵',
      rebindEmail: '換綁電郵',
      bindPhone: '綁定手機號碼',
      rebindPhone: '換綁手機號碼',
      
      enterNickname: '請輸入暱稱',
      
      // 狀態提示
      nicknameChanged: '暱稱修改成功',
      usernameChanged: '用戶名稱修改成功',
      emailBound: '電郵綁定成功',
      emailRebound: '電郵換綁成功',
      phoneBound: '手機號碼綁定成功',
      phoneRebound: '手機號碼換綁成功',
      unbindSuccess: '解除綁定成功',
      rebindSuccess: '換綁成功',
      alreadyBound: '該帳號已被其他用戶綁定',
      
      // OAuth相關
      rebindOAuth: '換綁{provider}',
      rebindOAuthHint: '點擊下方按鈕將跳轉到{provider}授權頁面進行換綁',
      rebindOAuthNote: '換綁後原綁定將被替換',
      startAuth: '開始授權',
      unbindConfirm: '確定要解除綁定{provider}嗎？',
      unbindConfirmTitle: '確認解除綁定',
      unbindConfirmMessage: '確定要解除綁定{provider}嗎？解除綁定後您將無法使用{provider}登入。',
      cannotUnbindWechat: '無法解除綁定：微信是您唯一的登入方式，請先綁定其他登入方式',
      cannotUnbindQQ: '無法解除綁定：QQ是您唯一的登入方式，請先綁定其他登入方式',
    },
  },
}
