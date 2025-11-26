export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    submit: 'Submit',
    reset: 'Reset',
    back: 'Back',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    optional: 'Optional',
    actions: 'Actions',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    operationFailed: 'Operation failed',
  },
  
  nav: {
    allMaterials: 'All Materials',
    miscMaterials: 'Miscellaneous',
    clothing: 'Clothing',
    collectible: 'Collections',
    categories: 'Categories',
    logout: 'Logout',
  },

  auth: {
    login: 'Login',
    register: 'Register',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    verificationCode: 'Verification Code',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create New Account',
    appTitle: 'Potatofield Inventory Master',
    loginBtn: 'Login',
    registerBtn: 'Register',
    verifyAndCompleteBtn: 'Verify Email & Complete',
    resendCodeBtn: 'Resend Code',
    registerMethod: 'Registration Method',
    emailRegister: 'Email Registration',
    phoneRegister: 'Phone Registration',
    
    // New fields
    emailOrUsername: 'Email/Username/Phone',
    enterEmailOrUsername: 'Enter email, username or phone',
    emailOrPhone: 'Email/Phone',
    enterEmailOrPhone: 'Enter email or phone number',
    graphicCaptcha: 'Captcha',
    enterCaptcha: 'Enter captcha',
    sendCode: 'Send Code',
    completeRegistration: 'Complete Registration',
    resendAfter: 'Resend after',
    resendCode: 'Resend Code',
    orLoginWith: 'Or login with',
    orRegisterWith: 'Or register with',
    wechat: 'WeChat',
    qq: 'QQ',
    
    // Placeholders
    enterUsername: 'Enter username (3-50 characters)',
    enterEmail: 'Enter email address',
    enterPhone: 'Enter phone number',
    enterPassword: 'Enter password (at least 6 characters)',
    reEnterPassword: 'Re-enter password',
    enterVerificationCode: 'Enter 6-digit code',
    
    // Validation messages
    usernameRequired: 'Username is required',
    usernameLength: 'Username must be 3-50 characters',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Please enter a valid phone number',
    passwordRequired: 'Password is required',
    passwordLength: 'Password must be at least 6 characters',
    confirmPasswordRequired: 'Please confirm your password',
    passwordMismatch: 'Passwords do not match',
    verificationCodeRequired: 'Verification code is required',
    verificationCodeInvalid: 'Code must be 6 digits',
    
    // Verification code related
    codeSentSuccess: 'Verification code sent',
    codeSentHint: 'Code sent, please check (valid for 5 minutes)',
    codeResendHint: 'Code resent successfully',
    codeExpired: 'Code expired, please resend',
    codeInvalid: 'Invalid verification code',
    sendingCode: 'Sending...',
    waitBeforeResend: 'Please wait {seconds} seconds before resending',
    
    // Response messages
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    registerSuccess: 'Registration successful',
    registerFailed: 'Registration failed',
    sendCodeSuccess: 'Verification code sent',
    sendCodeFailed: 'Failed to send code',
    getCaptchaFailed: 'Failed to get captcha',
    logoutSuccess: 'Logged out successfully',
    logoutConfirm: 'Are you sure you want to logout?',
    
    // OAuth related
    oauthNeedBind: 'This account is not bound, please bind an existing account or register a new one',
    oauthLoginSuccess: 'Third-party login successful',
    oauthLoginFailed: 'Third-party login failed',
    oauthBindSuccess: 'Binding successful',
    oauthBindFailed: 'Binding failed',
    bindExistingAccount: 'Bind Existing Account',
    registerNewAccount: 'Register New Account',
    chooseAction: 'Choose Action',
    oauthNotBoundHint: 'This third-party account is not bound to any account',
    bindExistingAccountHint: 'Login with existing credentials and bind',
    registerNewAccountHint: 'Register a new user with this third-party account',
    bindAndLogin: 'Bind and Login',
  },

  material: {
    // Types
    misc: 'Miscellaneous',
    clothing: 'Clothing',
    collectible: 'Collections',
    
    // Fields
    name: 'Material Name',
    type: 'Material Type',
    category: 'Category',
    location: 'Storage Location',
    photo: 'Photo',
    quantity: 'Total Quantity',
    inUseQuantity: 'In Use',
    stockQuantity: 'Stock',
    description: 'Description',
    
    // Actions
    addMaterial: 'Add Material',
    editMaterial: 'Edit Material',
    deleteMaterial: 'Delete Material',
    viewDetail: 'View Details',
    quickActions: 'Quick Actions',
    
    // Quick Actions
    restock: 'Restock',
    'take-out': 'Take Out',
    discard: 'Discard',
    replace: 'Replace',
    restockAmount: 'Amount',
    enterAmount: 'Enter amount',
    restockPrompt: 'Enter restock amount',
    invalidAmount: 'Please enter a valid amount',
    
    // Placeholders
    enterName: 'Enter material name',
    selectType: 'Select material type',
    selectCategory: 'Select category (optional)',
    enterLocation: 'Enter storage location',
    searchPlaceholder: 'Search materials...',
    enterDescription: 'Enter description (optional)',
    
    // Upload
    uploadPhoto: 'Click or drag to upload photo',
    uploadHint: 'Supports JPG, PNG format, max 5MB',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove Photo',
    
    // Validation
    nameRequired: 'Name, type and location are required',
    typeInvalid: 'Invalid material type',
    
    // Response messages
    createSuccess: 'Material created successfully',
    updateSuccess: 'Material updated successfully',
    deleteSuccess: 'Material deleted successfully',
    deleteConfirm: 'Are you sure you want to delete "{name}"?',
    restockSuccess: 'Restocked successfully',
    'take-outSuccess': 'Taken out successfully',
    discardSuccess: 'Discarded successfully',
    replaceSuccess: 'Replaced successfully',
    
    // Status
    noData: 'No materials found',
    addFirst: 'Add your first material now',
    notFound: 'Material not found or access denied',
    noCategory: 'No category',
  },

  category: {
    // Fields
    name: 'Category Name',
    type: 'Type',
    materialCount: 'Materials',
    title: 'Category',
    
    // Actions
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    manage: 'Manage Categories',
    
    // Placeholders
    enterName: 'Enter category name',
    selectType: 'Select type',
    
    // Validation
    nameRequired: 'Category name is required',
    typeRequired: 'Type is required',
    duplicateName: 'Category name already exists for this type',
    
    // Response messages
    createSuccess: 'Category created successfully',
    updateSuccess: 'Category updated successfully',
    deleteSuccess: 'Category deleted successfully',
    deleteConfirm: 'Delete category "{name}"?',
    deleteWarning: 'Cannot delete: {count} materials using this category',
    
    // Status
    noData: 'No categories',
    notFound: 'Category not found',
  },

  statistics: {
    title: 'Statistics',
    total: 'Total',
    misc: 'Misc',
    clothing: 'Clothing',
    collectible: 'Collections',
  },

  error: {
    networkError: 'Network error, please try again later',
    serverError: 'Server error',
    unauthorized: 'Unauthorized, please login again',
    forbidden: 'Access forbidden',
    notFound: 'Resource not found',
    requestFailed: 'Request failed',
  },

  settings: {
    title: 'Settings',
    theme: {
      title: 'Theme Color',
      changed: 'Theme changed',
    },
    darkMode: {
      title: 'Dark Mode',
      light: 'Always Light',
      dark: 'Always Dark',
      system: 'Follow System',
      changed: 'Dark mode updated',
    },
    account: {
      title: 'Account Settings',
      nickname: 'Nickname',
      username: 'Username',
      email: 'Email',
      phone: 'Phone',
      password: 'Password',
      changeEmail: 'Change Email',
      changePassword: 'Change Password',
      setPassword: 'Set Password',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      newEmail: 'New Email',
      fillAllFields: 'Please fill all fields',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      invalidEmail: 'Please enter a valid email',
      passwordChanged: 'Password changed successfully',
      passwordSet: 'Password set successfully',
      emailChanged: 'Email changed successfully',
      
      bindAccountFirst: 'Please bind a phone, email or username before setting a password',
      
      // Binding management
      notSet: 'Not Set',
      notBound: 'Not Bound',
      bound: 'Bound',
      bind: 'Bind',
      unbind: 'Unbind',
      rebind: 'Rebind',
      
      // Edit dialogs
      editNickname: 'Edit Nickname',
      editUsername: 'Edit Username',
      bindUsername: 'Bind Username',
      bindEmail: 'Bind Email',
      rebindEmail: 'Rebind Email',
      bindPhone: 'Bind Phone',
      rebindPhone: 'Rebind Phone',
      
      enterNickname: 'Enter nickname',
      
      // Status messages
      nicknameChanged: 'Nickname changed successfully',
      usernameChanged: 'Username changed successfully',
      emailBound: 'Email bound successfully',
      emailRebound: 'Email rebound successfully',
      phoneBound: 'Phone bound successfully',
      phoneRebound: 'Phone rebound successfully',
      unbindSuccess: 'Unbound successfully',
      rebindSuccess: 'Rebound successfully',
      alreadyBound: 'This account is already bound to another user',
      
      // OAuth related
      rebindOAuth: 'Rebind {provider}',
      rebindOAuthHint: 'Click the button below to authorize {provider} for rebinding',
      rebindOAuthNote: 'The original binding will be replaced after rebinding',
      startAuth: 'Start Authorization',
      unbindConfirm: 'Are you sure you want to unbind {provider}?',
      unbindConfirmTitle: 'Confirm Unbind',
      unbindConfirmMessage: 'Are you sure you want to unbind {provider}? You will not be able to login with {provider} after unbinding.',
      cannotUnbindWechat: 'Cannot unbind: WeChat is your only login method, please bind other login methods first',
      cannotUnbindQQ: 'Cannot unbind: QQ is your only login method, please bind other login methods first',
    },
  },
}
