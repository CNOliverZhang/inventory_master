<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <div class="logo-section">
        <el-icon :size="32" color="#1976D2">
          <Box />
        </el-icon>
        <h1 class="app-title">{{ t('auth.appTitle') }}</h1>
      </div>

      <!-- 用户信息 -->
      <div class="user-section">
        <el-dropdown trigger="click" @command="handleUserCommand">
          <div class="user-info">
            <el-avatar :size="40" :src="userAvatar">
              {{ userStore.user?.username.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="user-details">
              <div class="username">{{ userStore.user?.username }}</div>
              <div class="user-email">{{ userStore.user?.email }}</div>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">
                <el-icon><SwitchButton /></el-icon>
                {{ t('nav.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <nav class="nav-menu">
        <div
          v-for="item in menuItems"
          :key="item.type"
          class="nav-item"
          :class="{ active: materialStore.currentType === item.type }"
          @click="handleTypeChange(item.type)"
        >
          <el-icon :size="20">
            <component :is="item.icon" />
          </el-icon>
          <span class="nav-label">{{ t(item.labelKey) }}</span>
          <span class="nav-count">{{ getTypeCount(item.type) }}</span>
        </div>
      </nav>

      <div class="stats-section">
        <h3 class="stats-title">{{ t('statistics.title') }}</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ materialStore.statistics.total }}</div>
            <div class="stat-label">{{ t('statistics.total') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ materialStore.statistics.studio }}</div>
            <div class="stat-label">{{ t('statistics.studio') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ materialStore.statistics.clothing }}</div>
            <div class="stat-label">{{ t('statistics.clothing') }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ materialStore.statistics.misc }}</div>
            <div class="stat-label">{{ t('statistics.misc') }}</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部操作栏 -->
      <header class="content-header">
        <el-input
          v-model="materialStore.searchKeyword"
          :placeholder="t('material.searchPlaceholder')"
          :prefix-icon="Search"
          clearable
          class="search-input"
        />
        <el-button type="primary" :icon="Plus" size="large" @click="handleAdd">
          {{ t('material.addMaterial') }}
        </el-button>
        <!-- 语言切换器 -->
        <LanguageSwitcher />
      </header>

      <!-- 物资列表 -->
      <div v-loading="materialStore.loading" class="materials-grid">
        <el-empty
          v-if="materialStore.filteredMaterials.length === 0"
          :description="t('material.noData')"
        />
        <MaterialCard
          v-for="material in materialStore.filteredMaterials"
          :key="material.id"
          :material="material"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </main>

    <!-- 添加/编辑物资对话框 -->
    <MaterialDialog
      v-model="dialogVisible"
      :material="currentEditMaterial"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMaterialStore } from '@/stores/material'
import { useUserStore } from '@/stores/user'
import { MaterialType } from '@/types/material'
import type { Material } from '@/types/material'
import { ElMessageBox } from 'element-plus'
import { Search, Plus, Box, Briefcase, Handbag, Grid, SwitchButton } from '@element-plus/icons-vue'
import MaterialCard from '@/components/MaterialCard.vue'
import MaterialDialog from '@/components/MaterialDialog.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const materialStore = useMaterialStore()
const userStore = useUserStore()
const { t } = useI18n()

// 用户头像（使用首字母作为头像）
const userAvatar = computed(() => '')

// 菜单项配置
const menuItems = [
  { type: '', labelKey: 'nav.allMaterials', icon: Grid },
  { type: MaterialType.STUDIO, labelKey: 'nav.studioMaterials', icon: Briefcase },
  { type: MaterialType.CLOTHING, labelKey: 'nav.clothing', icon: Handbag },
  { type: MaterialType.MISC, labelKey: 'nav.misc', icon: Box },
]

// 对话框状态
const dialogVisible = ref(false)
const currentEditMaterial = ref<Material | null>(null)

// 处理用户下拉菜单命令
const handleUserCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm(t('auth.logoutConfirm'), t('common.warning'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }).then(() => {
      userStore.logout()
      router.push('/login')
    }).catch(() => {
      // 用户取消
    })
  }
}

// 获取类型数量
const getTypeCount = (type: string) => {
  if (type === '') return materialStore.statistics.total
  if (type === MaterialType.STUDIO) return materialStore.statistics.studio
  if (type === MaterialType.CLOTHING) return materialStore.statistics.clothing
  if (type === MaterialType.MISC) return materialStore.statistics.misc
  return 0
}

// 切换类型
const handleTypeChange = (type: MaterialType | '') => {
  materialStore.setCurrentType(type)
}

// 添加物资
const handleAdd = () => {
  currentEditMaterial.value = null
  dialogVisible.value = true
}

// 编辑物资
const handleEdit = (material: Material) => {
  currentEditMaterial.value = material
  dialogVisible.value = true
}

// 删除物资
const handleDelete = async (material: Material) => {
  try {
    await ElMessageBox.confirm(
      t('material.deleteConfirm', { name: material.name }),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    await materialStore.deleteMaterial(material.id)
  } catch (error) {
    // 用户取消删除
  }
}

// 对话框成功回调
const handleDialogSuccess = () => {
  dialogVisible.value = false
  currentEditMaterial.value = null
}

// 初始化
onMounted(async () => {
  await materialStore.fetchMaterials()
  await materialStore.fetchStatistics()
})
</script>

<style scoped lang="scss">
.home-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1976d2 0%, #1565c0 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
}

.user-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.user-details {
  flex: 1;
  overflow: hidden;
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 500;
  }
}

.nav-label {
  flex: 1;
  font-size: 15px;
}

.nav-count {
  font-size: 14px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 10px;
  border-radius: 12px;
}

.stats-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stats-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background-color: white;
  padding: 20px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.materials-grid {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  align-content: start;
}
</style>
