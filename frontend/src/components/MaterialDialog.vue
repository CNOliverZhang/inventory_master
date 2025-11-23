<template>
  <!-- 遮罩层 -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
    @click.self="handleClose"
  >
    <!-- 对话框 -->
    <div class="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col">
      <!-- 头部 - 固定 -->
      <div class="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800">
          {{ isEdit ? t('material.editMaterial') : t('material.addMaterial') }}
        </h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <i class="pi pi-times text-lg sm:text-xl"></i>
        </button>
      </div>

      <!-- 表单内容 - 可滚动 -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
        <!-- 物资名称 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
            {{ t('material.name') }}
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            :placeholder="t('material.enterName')"
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
          <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
        </div>

        <!-- 物资类型 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
            {{ t('material.type') }}
            <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.type"
            :disabled="isEdit"
            required
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>{{ t('material.selectType') }}</option>
            <option
              v-for="type in materialTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ t(`material.${type.value}`) }}
            </option>
          </select>
          <p v-if="errors.type" class="text-xs text-red-500">{{ errors.type }}</p>
        </div>

        <!-- 细分类别 -->
        <div v-if="formData.type" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">
            {{ t('material.category') }}
            <span class="text-gray-400 text-xs ml-1">({{ t('common.optional') }})</span>
          </label>
          <select
            v-model.number="formData.categoryId"
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          >
            <option :value="null">{{ t('material.selectCategory') }}</option>
            <option
              v-for="category in availableCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- 存放位置 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
            {{ t('material.location') }}
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.location"
            type="text"
            required
            :placeholder="t('material.enterLocation')"
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
          <p v-if="errors.location" class="text-xs text-red-500">{{ errors.location }}</p>
        </div>

        <!-- 照片上传 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">
            {{ t('material.photo') }}
          </label>
          <div
            class="upload-area relative w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer transition-colors bg-gray-50"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <!-- 预览图片 -->
            <div v-if="photoPreview || (isEdit && props.material?.photoUrl)" class="relative w-full h-full">
              <img
                :src="photoPreview || props.material?.photoUrl"
                alt="预览"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 sm:gap-3">
                <button
                  @click.stop="triggerFileInput"
                  class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-all"
                >
                  <i class="pi pi-pencil mr-1"></i>
                  {{ t('material.changePhoto') }}
                </button>
                <button
                  @click.stop="handleRemovePhoto"
                  class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <i class="pi pi-trash mr-1"></i>
                  {{ t('material.removePhoto') }}
                </button>
              </div>
            </div>
            <!-- 上传占位符 -->
            <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
              <i class="pi pi-cloud-upload upload-icon text-4xl sm:text-5xl mb-2 sm:mb-3"></i>
              <p class="text-xs sm:text-sm font-medium">{{ t('material.uploadPhoto') }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ t('material.uploadHint') }}</p>
            </div>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handlePhotoChange"
          />
        </div>

        <!-- 杂物：总数量 + 在用数量 -->
        <template v-if="formData.type === MaterialType.MISC">
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                {{ t('material.quantity') }}
              </label>
              <input
                v-model.number="formData.quantity"
                type="number"
                min="0"
                step="1"
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                {{ t('material.inUseQuantity') }}
              </label>
              <input
                v-model.number="formData.inUseQuantity"
                type="number"
                min="0"
                step="1"
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>
        </template>

        <!-- 收藏品：单数量 + 详细信息 -->
        <template v-else-if="formData.type === MaterialType.COLLECTIBLE">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">
              {{ t('material.quantity') }}
            </label>
            <input
              v-model.number="formData.quantity"
              type="number"
              min="0"
              step="1"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">
              {{ t('material.description') }}
              <span class="text-gray-400 text-xs ml-1">({{ t('common.optional') }})</span>
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              :placeholder="t('material.enterDescription')"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
            ></textarea>
          </div>
        </template>
      </div>

      <!-- 底部按钮 - 固定 -->
      <div class="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
        <button
          @click="handleClose"
          class="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="btn-gradient flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6"
        >
          <i v-if="loading" class="pi pi-spinner pi-spin"></i>
          {{ isEdit ? t('common.save') : t('material.addMaterial') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Material, MaterialForm } from '@/types/material'
import { MaterialType } from '@/types/material'
import { useMaterialStore } from '@/stores/material'
import { useCategoryStore } from '@/stores/category'

interface Props {
  modelValue: boolean
  material?: Material | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const materialStore = useMaterialStore()
const categoryStore = useCategoryStore()
const { t } = useI18n()

const materialTypes = [
  { value: MaterialType.MISC },
  { value: MaterialType.CLOTHING },
  { value: MaterialType.COLLECTIBLE },
]

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.material)

const fileInputRef = ref<HTMLInputElement>()
const loading = ref(false)
const photoPreview = ref('')
const photoFile = ref<File>()

const formData = reactive<MaterialForm>({
  name: '',
  type: MaterialType.MISC,
  categoryId: null,
  location: '',
  quantity: 0,
  inUseQuantity: 0,
  description: '',
})

const errors = reactive({
  name: '',
  type: '',
  location: '',
})

// 根据选中的类型获取可用的类别
const availableCategories = computed(() => {
  if (!formData.type) return []
  return categoryStore.categories.filter(c => c.type === formData.type)
})

// 监听类型变化，重新加载类别
watch(() => formData.type, async (newType) => {
  if (newType) {
    await categoryStore.fetchCategoriesByType(newType)
    // 如果当前选中的类别不属于新类型，清空选择
    if (formData.categoryId) {
      const category = categoryStore.categories.find(c => c.id === formData.categoryId)
      if (!category || category.type !== newType) {
        formData.categoryId = null
      }
    }
  }
})

// 重置表单
const resetForm = () => {
  photoPreview.value = ''
  photoFile.value = undefined
  formData.name = ''
  formData.type = MaterialType.MISC
  formData.categoryId = null
  formData.location = ''
  formData.quantity = 0
  formData.inUseQuantity = 0
  formData.description = ''
  errors.name = ''
  errors.type = ''
  errors.location = ''
  
  // 清除 file input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 监听对话框打开和 material 变化，填充表单
watch(
  [() => props.modelValue, () => props.material],
  async ([isVisible, material]) => {
    if (isVisible && material) {
      // 编辑模式：填充表单数据
      formData.name = material.name
      formData.type = material.type
      formData.categoryId = material.categoryId
      formData.location = material.location
      formData.quantity = material.quantity || 0
      formData.inUseQuantity = material.inUseQuantity || 0
      formData.description = material.description || ''
      photoPreview.value = ''
      photoFile.value = undefined
      
      // 加载该类型的类别
      await categoryStore.fetchCategoriesByType(material.type)
    } else if (isVisible && !material) {
      // 新建模式：重置表单
      resetForm()
      // 加载默认类型的类别
      await categoryStore.fetchCategoriesByType(MaterialType.MISC)
    } else if (!isVisible) {
      // 对话框关闭后延迟重置，避免视觉闪烁
      setTimeout(() => {
        if (!props.modelValue) {
          resetForm()
        }
      }, 300)
    }
  },
  { immediate: false }
)

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理照片选择
const handlePhotoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 处理拖放
const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 删除照片
const handleRemovePhoto = () => {
  photoPreview.value = ''
  photoFile.value = undefined
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 验证表单
const validateForm = () => {
  errors.name = ''
  errors.type = ''
  errors.location = ''
  
  let isValid = true
  
  if (!formData.name.trim()) {
    errors.name = t('material.enterName')
    isValid = false
  }
  
  if (!formData.type) {
    errors.type = t('material.selectType')
    isValid = false
  }
  
  if (!formData.location.trim()) {
    errors.location = t('material.enterLocation')
    isValid = false
  }
  
  return isValid
}

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const submitData: MaterialForm = {
      ...formData,
      photo: photoFile.value,
    }

    if (isEdit.value && props.material) {
      await materialStore.updateMaterial(props.material.id, submitData)
    } else {
      await materialStore.createMaterial(submitData)
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  // 不在这里重置表单，让 watch 处理
}
</script>

<style scoped>
.upload-icon {
  color: var(--color-primary-to);
}

.upload-area:hover {
  border-color: var(--color-primary-to);
}
</style>
