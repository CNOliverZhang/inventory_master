<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50"
    @click.self="handleClose"
  >
    <div class="w-full max-w-4xl glass-card p-4 sm:p-6 max-h-[90vh] overflow-hidden flex flex-col">
      <!-- 头部 -->
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
          {{ t('category.manage') }}
        </h2>
        <button
          @click="handleClose"
          class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <i class="pi pi-times text-gray-600"></i>
        </button>
      </div>

      <!-- 类型切换 -->
      <div class="flex gap-2 mb-4 sm:mb-6 overflow-x-auto">
        <button
          v-for="type in materialTypes"
          :key="type.value"
          @click="categoryStore.setCurrentType(type.value)"
          class="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg transition-colors font-medium whitespace-nowrap"
          :class="categoryStore.currentType === type.value
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ t(`material.${type.value}`) }}
        </button>
      </div>

      <!-- 添加类别表单 -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4">
        <div class="flex gap-2 sm:gap-3">
          <input
            v-model="newCategoryName"
            type="text"
            :placeholder="t('category.enterName')"
            class="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            @keypress.enter="handleAddCategory"
          />
          <button
            @click="handleAddCategory"
            :disabled="!newCategoryName.trim() || categoryStore.loading"
            class="btn-gradient flex items-center gap-2 text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed px-3 sm:px-6"
          >
            <i class="pi pi-plus"></i>
            <span class="hidden sm:inline">{{ t('category.addCategory') }}</span>
            <span class="sm:hidden">{{ t('common.add') }}</span>
          </button>
        </div>
      </div>

      <!-- 类别列表 -->
      <div class="flex-1 overflow-y-auto space-y-2">
        <div
          v-if="categoryStore.loading && categoryStore.filteredCategories.length === 0"
          class="text-center py-8 sm:py-12"
        >
          <i class="pi pi-spin pi-spinner text-2xl sm:text-3xl text-cyan-500"></i>
          <p class="mt-3 text-sm sm:text-base text-gray-600">{{ t('common.loading') }}</p>
        </div>

        <div
          v-else-if="categoryStore.filteredCategories.length === 0"
          class="text-center py-8 sm:py-12"
        >
          <i class="pi pi-inbox text-4xl sm:text-5xl text-gray-300"></i>
          <p class="mt-3 text-sm sm:text-base text-gray-600">{{ t('category.noData') }}</p>
        </div>

        <div
          v-else
          v-for="category in categoryStore.filteredCategories"
          :key="category.id"
          class="glass-card-hover p-3 sm:p-4 flex items-center justify-between group"
        >
          <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-secondary flex items-center justify-center flex-shrink-0">
              <i class="pi pi-tag text-white text-sm sm:text-base"></i>
            </div>
            <div class="flex-1 min-w-0">
              <input
                v-if="editingId === category.id"
                v-model="editingName"
                type="text"
                class="w-full px-2 sm:px-3 py-1 text-sm sm:text-base bg-white/50 border border-white/30 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-cyan-400"
                @keypress.enter="handleSaveEdit(category.id)"
                @blur="handleCancelEdit"
              />
              <h3 v-else class="font-medium text-sm sm:text-base text-gray-800 truncate">{{ category.name }}</h3>
              <p class="text-xs sm:text-sm text-gray-500 truncate">
                {{ t('material.' + category.type) }}
                <span v-if="getCategoryStats(category.id)" class="ml-2">
                  · {{ getCategoryStats(category.id) }} {{ t('category.materialCount') }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              v-if="editingId !== category.id"
              @click="handleStartEdit(category)"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/30 flex items-center justify-center text-blue-600"
            >
              <i class="pi pi-pencil text-sm"></i>
            </button>
            <button
              v-if="editingId === category.id"
              @click="handleSaveEdit(category.id)"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/30 flex items-center justify-center text-green-600"
            >
              <i class="pi pi-check text-sm"></i>
            </button>
            <button
              @click="handleDelete(category)"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/30 flex items-center justify-center text-red-600"
            >
              <i class="pi pi-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      :title="t('common.warning')"
      :message="t('category.deleteConfirm', { name: categoryToDelete?.name || '' })"
      :confirm-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="confirmDelete"
    />

    <!-- 删除警告对话框（仅提示，无需确认） -->
    <ConfirmDialog
      v-model="showDeleteWarning"
      :title="t('common.warning')"
      :message="deleteWarningMessage"
      :confirm-text="t('common.confirm')"
      cancel-text=""
      type="warning"
      @confirm="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '@/stores/category'
import { MaterialType } from '@/types/material'
import type { Category } from '@/types/category'
import ConfirmDialog from './ConfirmDialog.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t } = useI18n()
const categoryStore = useCategoryStore()

const materialTypes = [
  { value: MaterialType.STUDIO },
  { value: MaterialType.CLOTHING },
  { value: MaterialType.MISC },
]

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const newCategoryName = ref('')
const editingId = ref<number | null>(null)
const editingName = ref('')
const showDeleteConfirm = ref(false)
const categoryToDelete = ref<Category | null>(null)
const showDeleteWarning = ref(false)
const deleteWarningMessage = ref('')

// 获取类别统计
const getCategoryStats = (categoryId: number) => {
  const stats = categoryStore.categoryStats.find(s => s.id === categoryId)
  return stats?.materialCount || 0
}

// 监听对话框打开
watch(visible, async (val) => {
  if (val) {
    categoryStore.setCurrentType(MaterialType.STUDIO)
    await Promise.all([
      categoryStore.fetchCategories(),
      categoryStore.fetchCategoryStats(),
    ])
  }
})

// 添加类别
const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) return

  try {
    await categoryStore.createCategory({
      name: newCategoryName.value.trim(),
      type: categoryStore.currentType as MaterialType,
    })
    newCategoryName.value = ''
  } catch (error) {
    // 错误已在store中处理
  }
}

// 开始编辑
const handleStartEdit = (category: Category) => {
  editingId.value = category.id
  editingName.value = category.name
}

// 取消编辑
const handleCancelEdit = () => {
  editingId.value = null
  editingName.value = ''
}

// 保存编辑
const handleSaveEdit = async (id: number) => {
  if (!editingName.value.trim()) {
    handleCancelEdit()
    return
  }

  try {
    await categoryStore.updateCategory(id, {
      name: editingName.value.trim(),
    } as any)
    handleCancelEdit()
  } catch (error) {
    // 错误已在store中处理
  }
}

// 删除类别
const handleDelete = (category: Category) => {
  const stats = getCategoryStats(category.id)
  if (stats > 0) {
    deleteWarningMessage.value = t('category.deleteWarning', { count: stats })
    showDeleteWarning.value = true
    return
  }

  categoryToDelete.value = category
  showDeleteConfirm.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (categoryToDelete.value) {
    await categoryStore.deleteCategory(categoryToDelete.value.id)
    categoryToDelete.value = null
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  handleCancelEdit()
}
</script>

<style scoped>
/* 移除动画，提升性能 */
</style>
