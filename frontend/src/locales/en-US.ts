export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
  },
  
  nav: {
    allMaterials: 'All Materials',
    studioMaterials: 'Studio Materials',
    clothing: 'Clothing',
    misc: 'Miscellaneous',
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
    appTitle: 'Material Management System',
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
    studio: 'Studio Materials',
    clothing: 'Clothing',
    misc: 'Miscellaneous',
    
    // Fields
    name: 'Material Name',
    type: 'Material Type',
    location: 'Storage Location',
    photo: 'Photo',
    quantity: 'Quantity',
    inUseQuantity: 'In Use',
    stockQuantity: 'Stock',
    
    // Actions
    addMaterial: 'Add Material',
    editMaterial: 'Edit Material',
    deleteMaterial: 'Delete Material',
    viewDetail: 'View Details',
    
    // Placeholders
    enterName: 'Enter material name',
    selectType: 'Select material type',
    enterLocation: 'Enter storage location',
    searchPlaceholder: 'Search materials...',
    
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
    
    // Status
    noData: 'No materials found',
    notFound: 'Material not found or access denied',
  },

  statistics: {
    title: 'Statistics',
    total: 'Total',
    studio: 'Studio',
    clothing: 'Clothing',
    misc: 'Misc',
  },

  error: {
    networkError: 'Network error, please try again later',
    serverError: 'Server error',
    unauthorized: 'Unauthorized, please login again',
    forbidden: 'Access forbidden',
    notFound: 'Resource not found',
    requestFailed: 'Request failed',
  },
}
