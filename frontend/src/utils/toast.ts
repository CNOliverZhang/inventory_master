import type { ToastServiceMethods } from 'primevue/toastservice'

// 全局 Toast 实例
let toastInstance: ToastServiceMethods | null = null

// 设置 Toast 实例（在 App.vue 中调用）
export const setToastInstance = (instance: ToastServiceMethods) => {
  toastInstance = instance
  console.log('Toast instance initialized:', !!instance)
}

// Toast 工具函数
export const toast = {
  success: (message: string, summary: string = '成功') => {
    console.log('Toast.success called:', { message, summary, hasInstance: !!toastInstance })
    if (toastInstance) {
      toastInstance.add({
        severity: 'success',
        summary,
        detail: message,
        life: 3000,
      })
    } else {
      console.warn('Toast instance not initialized')
      // 降级方案：使用浏览器原生提示
      alert(`${summary}: ${message}`)
    }
  },
  
  error: (message: string, summary: string = '错误') => {
    console.log('Toast.error called:', { message, summary, hasInstance: !!toastInstance })
    if (toastInstance) {
      toastInstance.add({
        severity: 'error',
        summary,
        detail: message,
        life: 3000,
      })
    } else {
      console.warn('Toast instance not initialized')
      alert(`${summary}: ${message}`)
    }
  },
  
  warning: (message: string, summary: string = '警告') => {
    console.log('Toast.warning called:', { message, summary, hasInstance: !!toastInstance })
    if (toastInstance) {
      toastInstance.add({
        severity: 'warn',
        summary,
        detail: message,
        life: 3000,
      })
    } else {
      console.warn('Toast instance not initialized')
      alert(`${summary}: ${message}`)
    }
  },
  
  info: (message: string, summary: string = '提示') => {
    console.log('Toast.info called:', { message, summary, hasInstance: !!toastInstance })
    if (toastInstance) {
      toastInstance.add({
        severity: 'info',
        summary,
        detail: message,
        life: 3000,
      })
    } else {
      console.warn('Toast instance not initialized')
      alert(`${summary}: ${message}`)
    }
  },
}

