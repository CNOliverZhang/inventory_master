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
    password: 'Password',
    confirmPassword: 'Confirm Password',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create New Account',
    appTitle: 'Potatofield Inventory Master',
    loginBtn: 'Login',
    registerBtn: 'Register',
    
    // Placeholders
    enterUsername: 'Enter username (3-50 characters)',
    enterEmail: 'Enter email address',
    enterPassword: 'Enter password (at least 6 characters)',
    reEnterPassword: 'Re-enter password',
    
    // Validation messages
    usernameRequired: 'Username is required',
    usernameLength: 'Username must be 3-50 characters',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    passwordRequired: 'Password is required',
    passwordLength: 'Password must be at least 6 characters',
    confirmPasswordRequired: 'Please confirm your password',
    passwordMismatch: 'Passwords do not match',
    
    // Response messages
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    logoutSuccess: 'Logged out successfully',
    logoutConfirm: 'Are you sure you want to logout?',
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
      username: 'Username',
      email: 'Email',
      password: 'Password',
      changeEmail: 'Change Email',
      changePassword: 'Change Password',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      newEmail: 'New Email',
      fillAllFields: 'Please fill all fields',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      invalidEmail: 'Please enter a valid email',
      passwordChanged: 'Password changed successfully',
      emailChanged: 'Email changed successfully',
    },
  },
}
