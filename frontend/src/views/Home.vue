<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 px-4 sm:px-6 py-3 sm:py-4 sticky top-2 sm:top-4 z-50 shadow-sm backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-2xl">
      <div class="flex items-center justify-between">
        <!-- Logo和标题 -->
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
            <img src="@/assets/images/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <h1 class="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            {{ t('auth.appTitle') }}
          </h1>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex items-center gap-3 sm:gap-5">
          <LanguageSwitcher />
          
          <!-- 用户菜单 -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full gradient-primary p-[2px] shadow-md group-hover:shadow-lg transition-all">
                 <div class="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-bold text-sm avatar-text">
                    {{ userStore.user?.username.charAt(0).toUpperCase() }}
                 </div>
              </div>
              <div class="flex flex-col items-start hidden sm:flex">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-none">{{ userStore.user?.username }}</span>
                  <span class="text-[10px] text-gray-500 dark:text-gray-400 font-medium">User</span>
              </div>
              <i class="pi pi-chevron-down text-xs text-gray-400 transition-colors hidden sm:block ml-1 chevron-hover"></i>
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

    <div class="flex flex-col lg:flex-row gap-6 mx-2 sm:mx-4 mt-4 sm:mt-6 pb-6">
      <!-- 左侧边栏 -->
      <aside class="w-full lg:w-72 glass-card p-5 sm:p-6 space-y-6 lg:h-fit lg:sticky lg:top-28 rounded-2xl">
        <!-- 分类导航 -->
        <nav class="space-y-2">
          <button
            v-for="item in menuItems"
            :key="item.type"
            @click="handleTypeChange(item.type)"
            class="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group nav-item"
            :class="materialStore.currentType === item.type 
              ? 'nav-item-active text-white scale-[1.02]' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:pl-5'"
          >
            <div class="flex items-center gap-3">
              <i :class="item.icon" class="text-lg transition-transform group-hover:scale-110"></i>
              <span class="font-medium tracking-wide">{{ t(item.labelKey) }}</span>
            </div>
            <span class="px-2 py-0.5 rounded-md text-xs font-bold transition-colors"
                  :class="materialStore.currentType === item.type ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">
              {{ getTypeCount(item.type) }}
            </span>
          </button>
        </nav>

        <!-- 细分类别筛选 -->
        <div v-if="materialStore.currentType && currentTypeCategories.length > 0" class="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">{{ t('category.title') }}</h3>
          <div class="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            <button
              @click="handleCategoryChange(null)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm"
              :class="materialStore.currentCategoryId === null 
                ? 'category-active font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              <span>{{ t('nav.allMaterials') }}</span>
            </button>
            <button
              v-for="category in currentTypeCategories"
              :key="category.id"
              @click="handleCategoryChange(category.id)"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm"
              :class="materialStore.currentCategoryId === category.id 
                ? 'category-active font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'"
            >
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>

        <!-- 统计概览 -->
        <div class="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{{ t('statistics.title') }}</h3>
          
          <!-- 总数量卡片 -->
          <div class="stat-card-total gradient-primary rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group stat-card-shadow">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
            <div class="flex items-center justify-between relative z-10">
              <div>
                <div class="text-sm font-medium opacity-90 mb-1">{{ t('statistics.total') }}</div>
                <div class="text-4xl font-bold tracking-tight">{{ materialStore.statistics.total }}</div>
              </div>
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <i class="pi pi-chart-bar text-2xl"></i>
              </div>
            </div>
          </div>
          
          <!-- 分类统计 -->
          <div class="grid grid-cols-1 gap-3">
            <!-- 杂物 -->
            <div class="stat-item bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <i class="pi pi-briefcase text-blue-600 dark:text-blue-400 text-sm"></i>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('statistics.misc') }}</span>
                </div>
                <span class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ materialStore.statistics.misc }}</span>
              </div>
              <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: getPercentage('misc') + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- 衣物 -->
            <div class="stat-item bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <i class="pi pi-shopping-bag text-green-600 dark:text-green-400 text-sm"></i>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('statistics.clothing') }}</span>
                </div>
                <span class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ materialStore.statistics.clothing }}</span>
              </div>
              <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: getPercentage('clothing') + '%' }"
                ></div>
              </div>
            </div>
            
            <!-- 收藏品 -->
            <div class="stat-item bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <i class="pi pi-box text-orange-600 dark:text-orange-400 text-sm"></i>
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('statistics.collectible') }}</span>
                </div>
                <span class="text-lg font-bold text-gray-800 dark:text-gray-100">{{ materialStore.statistics.collectible }}</span>
              </div>
              <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: getPercentage('collectible') + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 space-y-6">
        <!-- 搜索和操作栏 -->
        <div class="glass-card px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-2xl">
          <div class="flex-1 relative group">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors icon-focus"></i>
            <input
              v-model="materialStore.searchKeyword"
              type="text"
              :placeholder="t('material.searchPlaceholder')"
              class="w-full pl-11 pr-4 py-3 text-sm bg-gray-50 dark:bg-gray-700/50 border border-transparent focus:bg-white dark:focus:bg-gray-800 border-gray-100 dark:border-gray-700 rounded-xl 
                     focus:outline-none focus:ring-2 transition-all shadow-inner input-focus"
            />
          </div>
          
          <div class="flex gap-3">
            <button @click="handleAdd" class="btn-gradient flex-1 sm:flex-initial flex items-center justify-center gap-2 whitespace-nowrap text-sm px-6 py-3 rounded-xl">
              <i class="pi pi-plus font-bold"></i>
              <span class="hidden sm:inline font-semibold">{{ t('material.addMaterial') }}</span>
              <span class="sm:hidden font-semibold">{{ t('common.add') }}</span>
            </button>

            <button @click="showCategoryManage = true" class="btn-glass flex-1 sm:flex-initial flex items-center justify-center gap-2 whitespace-nowrap text-sm px-6 py-3 rounded-xl">
              <i class="pi pi-list"></i>
              <span class="hidden sm:inline font-medium">{{ t('nav.categories') }}</span>
              <span class="sm:hidden font-medium">{{ t('category.title') }}</span>
            </button>
          </div>
        </div>

        <!-- 物资网格 -->
        <div v-if="materialStore.loading" class="glass-card p-12 text-center rounded-2xl">
          <i class="pi pi-spin pi-spinner text-4xl loading-spinner"></i>
          <p class="mt-4 text-base text-gray-500">{{ t('common.loading') }}</p>
        </div>
        
        <div v-else-if="materialStore.filteredMaterials.length === 0" class="glass-card p-12 text-center rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
          <div class="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <i class="pi pi-inbox text-5xl text-gray-300 dark:text-gray-600"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ t('material.noData') }}</h3>
          <p class="text-gray-500 max-w-xs mx-auto">{{ t('material.addFirst') }}</p>
          <button @click="handleAdd" class="mt-6 font-medium flex items-center gap-2 transition-colors text-link">
            <i class="pi pi-plus"></i>
            {{ t('material.addMaterial') }}
          </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
  { type: MaterialType.MISC, labelKey: 'nav.miscMaterials', icon: 'pi pi-briefcase' },
  { type: MaterialType.CLOTHING, labelKey: 'nav.clothing', icon: 'pi pi-shopping-bag' },
  { type: MaterialType.COLLECTIBLE, labelKey: 'nav.collectible', icon: 'pi pi-box' },
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
  if (type === MaterialType.MISC) return materialStore.statistics.misc
  if (type === MaterialType.CLOTHING) return materialStore.statistics.clothing
  if (type === MaterialType.COLLECTIBLE) return materialStore.statistics.collectible
  return 0
}

// 计算百分比
const getPercentage = (type: 'misc' | 'clothing' | 'collectible') => {
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
