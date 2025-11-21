<template>
  <!-- 遮罩层 -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
    @click.self="handleClose"
  >
    <!-- 对话框 -->
    <div class="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="sticky top-0 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-b border-white/50 flex items-center justify-between">
        <h2 class="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {{ isEdit ? t('material.editMaterial') : t('material.addMaterial') }}
        </h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <i class="pi pi-times text-lg sm:text-xl"></i>
        </button>
      </div>

      <!-- 表单内容 -->
      <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
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
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
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
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            v-model="formData.categoryId"
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          >
            <option :value="undefined">{{ t('material.selectCategory') }}</option>
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
            class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          <p v-if="errors.location" class="text-xs text-red-500">{{ errors.location }}</p>
        </div>

        <!-- 照片上传 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">
            {{ t('material.photo') }}
          </label>
          <div
            class="relative w-full h-40 sm:h-48 border-2 border-dashed border-cyan-300 rounded-xl overflow-hidden cursor-pointer hover:border-cyan-500 transition-all bg-white/30"
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
                  class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all"
                >
                  <i class="pi pi-pencil mr-1"></i>
                  {{ t('material.changePhoto') }}
                </button>
                <button
                  @click.stop="handleRemovePhoto"
                  class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600/80 transition-all"
                >
                  <i class="pi pi-trash mr-1"></i>
                  {{ t('material.removePhoto') }}
                </button>
              </div>
            </div>
            <!-- 上传占位符 -->
            <div v-else class="flex flex-col items-center justify-center h-full text-gray-500">
              <i class="pi pi-cloud-upload text-4xl sm:text-5xl mb-2 sm:mb-3 text-cyan-400"></i>
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

        <!-- 工作室物料：双数量 -->
        <template v-if="formData.type === MaterialType.STUDIO">
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                {{ t('material.inUseQuantity') }}
              </label>
              <input
                v-model.number="formData.inUseQuantity"
                type="number"
                min="0"
                step="1"
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                {{ t('material.stockQuantity') }}
              </label>
              <input
                v-model.number="formData.stockQuantity"
                type="number"
                min="0"
                step="1"
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>
        </template>

        <!-- 杂物：单数量 -->
        <template v-else-if="formData.type === MaterialType.MISC">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">
              {{ t('material.quantity') }}
            </label>
            <input
              v-model.number="formData.quantity"
              type="number"
              min="0"
              step="1"
              class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-white/50 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>
        </template>
      </div>

      <!-- 底部按钮 -->
      <div class="sticky bottom-0 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-t border-white/50 flex justify-end gap-2 sm:gap-3">
        <button
          @click="handleClose"
          class="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all"
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
  { value: MaterialType.STUDIO },
  { value: MaterialType.CLOTHING },
  { value: MaterialType.MISC },
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
  type: MaterialType.STUDIO,
  categoryId: undefined,
  location: '',
  quantity: 0,
  inUseQuantity: 0,
  stockQuantity: 0,
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
        formData.categoryId = undefined
      }
    }
  }
})

// 重置表单
const resetForm = () => {
  photoPreview.value = ''
  photoFile.value = undefined
  formData.name = ''
  formData.type = MaterialType.STUDIO
  formData.categoryId = undefined
  formData.location = ''
  formData.quantity = 0
  formData.inUseQuantity = 0
  formData.stockQuantity = 0
  errors.name = ''
  errors.type = ''
  errors.location = ''
}

// 监听 material 变化，填充表单
watch(
  () => props.material,
  async (material) => {
    if (material) {
      formData.name = material.name
      formData.type = material.type
      formData.categoryId = material.categoryId
      formData.location = material.location
      formData.quantity = material.quantity
      formData.inUseQuantity = material.inUseQuantity
      formData.stockQuantity = material.stockQuantity
      photoPreview.value = ''
      photoFile.value = undefined
      
      // 加载该类型的类别
      await categoryStore.fetchCategoriesByType(material.type)
    } else {
      resetForm()
    }
  },
  { immediate: true }
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
  resetForm()
}
</script>
