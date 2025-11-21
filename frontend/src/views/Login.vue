<template>
  <div class="login-container">
    <!-- 语言切换器 -->
    <div class="language-switcher">
      <LanguageSwitcher />
    </div>

    <div class="login-card">
      <div class="login-header">
        <el-icon :size="48" color="#1976D2">
          <Box />
        </el-icon>
        <h1 class="title">{{ t('auth.appTitle') }}</h1>
        <p class="subtitle">{{ isLogin ? t('auth.welcomeBack') : t('auth.createAccount') }}</p>
      </div>

      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane :label="t('auth.login')" name="login">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
            class="login-form"
          >
            <el-form-item :label="t('auth.email')" prop="email">
              <el-input
                v-model="loginForm.email"
                :prefix-icon="Message"
                :placeholder="t('auth.enterEmail')"
                size="large"
              />
            </el-form-item>

            <el-form-item :label="t('auth.password')" prop="password">
              <el-input
                v-model="loginForm.password"
                :prefix-icon="Lock"
                type="password"
                :placeholder="t('auth.enterPassword')"
                size="large"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="submit-btn"
              @click="handleLogin"
            >
              {{ t('auth.loginBtn') }}
            </el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="t('auth.register')" name="register">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-position="top"
            class="login-form"
          >
            <el-form-item :label="t('auth.username')" prop="username">
              <el-input
                v-model="registerForm.username"
                :prefix-icon="User"
                :placeholder="t('auth.enterUsername')"
                size="large"
              />
            </el-form-item>

            <el-form-item :label="t('auth.email')" prop="email">
              <el-input
                v-model="registerForm.email"
                :prefix-icon="Message"
                :placeholder="t('auth.enterEmail')"
                size="large"
              />
            </el-form-item>

            <el-form-item :label="t('auth.password')" prop="password">
              <el-input
                v-model="registerForm.password"
                :prefix-icon="Lock"
                type="password"
                :placeholder="t('auth.enterPassword')"
                size="large"
                show-password
              />
            </el-form-item>

            <el-form-item :label="t('auth.confirmPassword')" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                :prefix-icon="Lock"
                type="password"
                :placeholder="t('auth.reEnterPassword')"
                size="large"
                show-password
                @keyup.enter="handleRegister"
              />
            </el-form-item>

            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="submit-btn"
              @click="handleRegister"
            >
              {{ t('auth.registerBtn') }}
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginForm, RegisterForm } from '@/types/user'
import { Box, Message, Lock, User } from '@element-plus/icons-vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const activeTab = ref('login')
const loading = ref(false)

const isLogin = computed(() => activeTab.value === 'login')

// 登录表单
const loginFormRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
})

const loginRules = computed<FormRules>(() => ({
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
  ],
}))

// 注册表单
const registerFormRef = ref<FormInstance>()
const registerForm = reactive<RegisterForm>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 验证确认密码
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('auth.confirmPasswordRequired')))
  } else if (value !== registerForm.password) {
    callback(new Error(t('auth.passwordMismatch')))
  } else {
    callback()
  }
}

const registerRules = computed<FormRules>(() => ({
  username: [
    { required: true, message: t('auth.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('auth.usernameLength'), trigger: 'blur' },
  ],
  email: [
    { required: true, message: t('auth.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('auth.emailInvalid'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('auth.passwordLength'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' },
  ],
}))

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await userStore.login(loginForm)
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      loading.value = false
    }
  })
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await userStore.register(registerForm)
      router.push('/')
    } catch (error) {
      console.error('Register error:', error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.login-header {
  text-align: center;
  padding: 40px 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #1976d2;
  margin: 16px 0 8px;
}

.subtitle {
  font-size: 14px;
  color: #757575;
  margin: 0;
}

.login-tabs {
  padding: 0 40px 40px;

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    font-size: 16px;
    font-weight: 500;
  }
}

.login-form {
  margin-top: 24px;
}

.submit-btn {
  width: 100%;
  margin-top: 12px;
  font-size: 16px;
  height: 44px;
}
</style>
