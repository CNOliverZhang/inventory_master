<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 px-3 sm:px-6 py-3 sm:py-4 sticky top-2 sm:top-4 z-50 shadow-sm">
      <div class="flex items-center justify-between">
        <!-- Logo和标题 -->
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg gradient-primary flex items-center justify-center">
            <i class="pi pi-box text-white text-base sm:text-xl"></i>
          </div>
          <h1 class="text-lg sm:text-2xl font-bold text-gray-800">
            {{ t('auth.appTitle') }}
          </h1>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          
          <!-- 用户菜单 -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-1 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                {{ userStore.user?.username.charAt(0).toUpperCase() }}
              </div>
              <span class="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">{{ userStore.user?.username }}</span>
              <i class="pi pi-chevron-down text-xs text-gray-500 hidden sm:block"></i>
            </button>
            
            <!-- 下拉菜单 -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2"
            >
              <button
                @click="handleSettings"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <i class="pi pi-cog"></i>
                {{ t('settings.title') }}
              </button>
              <button
                @click="handleLogout"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <i class="pi pi-sign-out"></i>
                {{ t('nav.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-col lg:flex-row gap-4 mx-2 sm:mx-4 mt-2 sm:mt-4 pb-4">
      <!-- 左侧边栏 -->
      <aside class="w-full lg:w-64 glass-card p-4 sm:p-6 space-y-4 sm:space-y-6 lg:h-fit lg:sticky lg:top-24">
        <!-- 分类导航 -->
        <nav class="space-y-2">
          <button
            v-for="item in menuItems"
            :key="item.type"
            @click="handleTypeChange(item.type)"
            class="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
            :class="materialStore.currentType === item.type 
              ? 'gradient-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'"
          >
            <div class="flex items-center gap-2 sm:gap-3">
              <i :class="item.icon" class="text-base sm:text-lg"></i>
              <span class="font-medium">{{ t(item.labelKey) }}</span>
            </div>
            <span class="px-1.5 sm:px-2 py-0.5 rounded-md text-xs font-semibold"
                  :class="materialStore.currentType === item.type ? 'bg-white/20' : 'bg-gray-200'">
              {{ getTypeCount(item.type) }}
            </span>
          </button>
        </nav>

        <!-- 细分类别筛选 -->
        <div v-if="materialStore.currentType && currentTypeCategories.length > 0" class="space-y-2">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-600 px-2">{{ t('category.title') }}</h3>
          <div class="max-h-48 overflow-y-auto space-y-1">
            <button
              @click="handleCategoryChange(null)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm"
              :class="materialStore.currentCategoryId === null 
                ? 'category-active font-medium' 
                : 'text-gray-600 hover:bg-gray-100'"
            >
              <span>{{ t('nav.allMaterials') }}</span>
            </button>
            <button
              v-for="category in currentTypeCategories"
              :key="category.id"
              @click="handleCategoryChange(category.id)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm"
              :class="materialStore.currentCategoryId === category.id 
                ? 'category-active font-medium' 
                : 'text-gray-600 hover:bg-gray-100'"
            >
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>

        <!-- 统计概览 -->
        <div class="space-y-3">
          <h3 class="text-xs sm:text-sm font-semibold text-gray-600 mb-3">{{ t('statistics.title') }}</h3>
          
          <!-- 总数量卡片 -->
          <div class="stat-card-total gradient-primary rounded-xl p-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs opacity-90 mb-1">{{ t('statistics.total') }}</div>
                <div class="text-3xl font-bold">{{ materialStore.statistics.total }}</div>
              </div>
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i class="pi pi-box text-2xl"></i>
              </div>
            </div>
          </div>
          
          <!-- 分类统计 -->
          <div class="space-y-2">
            <!-- 工作室物料 -->
            <div class="stat-item glass-card-hover p-3 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-briefcase text-blue-600 text-sm"></i>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ t('statistics.studio') }}</span>
                </div>
                <span class="text-lg font-bold text-blue-600">{{ materialStore.statistics.studio }}</span>
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  :style="{ width: getPercentage('studio') + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- 服装 -->
            <div class="stat-item glass-card-hover p-3 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-shopping-bag text-green-600 text-sm"></i>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ t('statistics.clothing') }}</span>
                </div>
                <span class="text-lg font-bold text-green-600">{{ materialStore.statistics.clothing }}</span>
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  :style="{ width: getPercentage('clothing') + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- 杂物 -->
            <div class="stat-item glass-card-hover p-3 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i class="pi pi-box text-orange-600 text-sm"></i>
                  </div>
                  <span class="text-sm font-medium text-gray-700">{{ t('statistics.misc') }}</span>
                </div>
                <span class="text-lg font-bold text-orange-600">{{ materialStore.statistics.misc }}</span>
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                  :style="{ width: getPercentage('misc') + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 space-y-4">
        <!-- 搜索和操作栏 -->
        <div class="glass-card px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div class="flex-1 relative">
            <i class="pi pi-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="materialStore.searchKeyword"
              type="text"
              :placeholder="t('material.searchPlaceholder')"
              class="w-full pl-9 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div class="flex gap-2">
            <button @click="handleAdd" class="btn-gradient flex-1 sm:flex-initial flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base px-3 sm:px-6">
              <i class="pi pi-plus"></i>
              <span class="hidden sm:inline">{{ t('material.addMaterial') }}</span>
              <span class="sm:hidden">{{ t('common.add') }}</span>
            </button>

            <button @click="showCategoryManage = true" class="btn-glass flex-1 sm:flex-initial flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base px-3 sm:px-6">
              <i class="pi pi-list"></i>
              <span class="hidden sm:inline">{{ t('nav.categories') }}</span>
              <span class="sm:hidden">{{ t('category.title') }}</span>
            </button>
          </div>
        </div>

        <!-- 物资网格 -->
        <div v-if="materialStore.loading" class="glass-card p-8 sm:p-12 text-center">
          <i class="pi pi-spin pi-spinner text-3xl sm:text-4xl text-cyan-500"></i>
          <p class="mt-4 text-sm sm:text-base text-gray-600">{{ t('common.loading') }}</p>
        </div>
        
        <div v-else-if="materialStore.filteredMaterials.length === 0" class="glass-card p-8 sm:p-12 text-center">
          <i class="pi pi-inbox text-5xl sm:text-6xl text-gray-300"></i>
          <p class="mt-4 text-sm sm:text-base text-gray-600">{{ t('material.noData') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
          <MaterialCard
            v-for="material in materialStore.filteredMaterials"
            :key="material.id"
            :material="material"
            @edit="handleEdit"
            @delete="handleDelete"
            @refresh="loadData"
          />
        </div>
      </main>
    </div>

    <!-- 添加/编辑物资对话框 -->
    <MaterialDialog
      v-model="dialogVisible"
      :material="currentEditMaterial"
      @success="handleDialogSuccess"
    />

    <!-- 分类管理对话框 -->
    <CategoryManageDialog
      v-model="showCategoryManage"
    />

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      :title="t('common.warning')"
      :message="t('material.deleteConfirm', { name: materialToDelete?.name || '' })"
      :confirm-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="confirmDelete"
    />

    <!-- 退出登录确认对话框 -->
    <ConfirmDialog
      v-model="showLogoutConfirm"
      :title="t('common.warning')"
      :message="t('auth.logoutConfirm')"
      :confirm-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      type="warning"
      @confirm="confirmLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMaterialStore } from '@/stores/material'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import { MaterialType } from '@/types/material'
import type { Material } from '@/types/material'
import MaterialCard from '@/components/MaterialCard.vue'
import MaterialDialog from '@/components/MaterialDialog.vue'
import CategoryManageDialog from '@/components/CategoryManageDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const materialStore = useMaterialStore()
const categoryStore = useCategoryStore()
const userStore = useUserStore()
const { t } = useI18n()

// 菜单项配置
const menuItems: Array<{ type: MaterialType | '', labelKey: string, icon: string }> = [
  { type: '', labelKey: 'nav.allMaterials', icon: 'pi pi-th-large' },
  { type: MaterialType.STUDIO, labelKey: 'nav.studioMaterials', icon: 'pi pi-briefcase' },
  { type: MaterialType.CLOTHING, labelKey: 'nav.clothing', icon: 'pi pi-shopping-bag' },
  { type: MaterialType.MISC, labelKey: 'nav.misc', icon: 'pi pi-box' },
]

// 状态
const dialogVisible = ref(false)
const currentEditMaterial = ref<Material | null>(null)
const showUserMenu = ref(false)
const showCategoryManage = ref(false)
const userMenuRef = ref<HTMLElement>()
const showDeleteConfirm = ref(false)
const materialToDelete = ref<Material | null>(null)
const showLogoutConfirm = ref(false)

// 获取类型数量
const getTypeCount = (type: MaterialType | '') => {
  if (type === '') return materialStore.statistics.total
  if (type === MaterialType.STUDIO) return materialStore.statistics.studio
  if (type === MaterialType.CLOTHING) return materialStore.statistics.clothing
  if (type === MaterialType.MISC) return materialStore.statistics.misc
  return 0
}

// 计算百分比
const getPercentage = (type: 'studio' | 'clothing' | 'misc') => {
  const total = materialStore.statistics.total
  if (total === 0) return 0
  const count = materialStore.statistics[type]
  return Math.round((count / total) * 100)
}

// 切换类型
const handleTypeChange = (type: MaterialType | '') => {
  materialStore.setCurrentType(type)
}

// 切换类别筛选
const handleCategoryChange = (categoryId: number | null) => {
  materialStore.setCurrentCategoryId(categoryId)
}

// 当前类型的类别列表
const currentTypeCategories = computed(() => {
  if (!materialStore.currentType) return []
  return categoryStore.categories.filter(c => c.type === materialStore.currentType)
})

// 监听类型变化，加载对应的类别
watch(() => materialStore.currentType, async (newType) => {
  if (newType) {
    await categoryStore.fetchCategoriesByType(newType)
  }
})

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
const handleDelete = (material: Material) => {
  materialToDelete.value = material
  showDeleteConfirm.value = true
}

// 确认删除物资
const confirmDelete = async () => {
  if (materialToDelete.value) {
    await materialStore.deleteMaterial(materialToDelete.value.id)
    materialToDelete.value = null
  }
}

// 对话框成功回调
const handleDialogSuccess = () => {
  dialogVisible.value = false
  currentEditMaterial.value = null
}

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 进入设置页面
const handleSettings = () => {
  showUserMenu.value = false
  router.push('/settings')
}

// 退出登录
const handleLogout = () => {
  showUserMenu.value = false
  showLogoutConfirm.value = true
}

// 确认退出
const confirmLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 点击外部关闭用户菜单
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// 刷新数据
const loadData = async () => {
  await materialStore.fetchMaterials()
  await materialStore.fetchStatistics()
}

// 初始化
onMounted(async () => {
  await loadData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.category-active {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary-to);
}

.stat-card-total {
  position: relative;
  overflow: hidden;
}

.stat-card-total::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.stat-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-item:hover {
  transform: translateX(4px);
}
</style>
