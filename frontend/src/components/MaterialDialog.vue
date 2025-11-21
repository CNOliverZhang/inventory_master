<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? t('material.editMaterial') : t('material.addMaterial')"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-form-item :label="t('material.name')" prop="name">
        <el-input v-model="formData.name" :placeholder="t('material.enterName')" clearable />
      </el-form-item>

      <el-form-item :label="t('material.type')" prop="type">
        <el-select
          v-model="formData.type"
          :placeholder="t('material.selectType')"
          :disabled="isEdit"
          style="width: 100%"
        >
          <el-option
            v-for="type in materialTypes"
            :key="type.value"
            :label="t(`material.${type.value}`)"
            :value="type.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('material.location')" prop="location">
        <el-input v-model="formData.location" :placeholder="t('material.enterLocation')" clearable />
      </el-form-item>

      <el-form-item :label="t('material.photo')" prop="photo">
        <el-upload
          class="upload-container"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handlePhotoChange"
          accept="image/*"
          drag
        >
          <div v-if="photoPreview || (isEdit && props.material?.photoUrl)" class="photo-preview">
            <img :src="photoPreview || props.material?.photoUrl" alt="预览" />
            <div class="photo-mask">
              <el-button type="primary" :icon="Edit" circle @click.stop="handleReupload" />
              <el-button type="danger" :icon="Delete" circle @click.stop="handleRemovePhoto" />
            </div>
          </div>
          <div v-else class="upload-placeholder">
            <el-icon :size="50" color="#C0C4CC">
              <Picture />
            </el-icon>
            <div class="upload-text">
              <p>{{ t('material.uploadPhoto') }}</p>
              <p class="upload-hint">{{ t('material.uploadHint') }}</p>
            </div>
          </div>
        </el-upload>
      </el-form-item>

      <!-- 工作室物料：双数量 -->
      <template v-if="formData.type === MaterialType.STUDIO">
        <el-form-item :label="t('material.inUseQuantity')" prop="inUseQuantity">
          <el-input-number
            v-model="formData.inUseQuantity"
            :min="0"
            :step="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="t('material.stockQuantity')" prop="stockQuantity">
          <el-input-number
            v-model="formData.stockQuantity"
            :min="0"
            :step="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </template>

      <!-- 杂物：单数量 -->
      <template v-else-if="formData.type === MaterialType.MISC">
        <el-form-item :label="t('material.quantity')" prop="quantity">
          <el-input-number
            v-model="formData.quantity"
            :min="0"
            :step="1"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        {{ isEdit ? t('common.save') : t('material.addMaterial') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import type { Material, MaterialForm } from '@/types/material'
import { MaterialType } from '@/types/material'
import { useMaterialStore } from '@/stores/material'
import { Picture, Edit, Delete } from '@element-plus/icons-vue'

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

const formRef = ref<FormInstance>()
const loading = ref(false)
const photoPreview = ref('')
const photoFile = ref<File>()

const formData = reactive<MaterialForm>({
  name: '',
  type: MaterialType.STUDIO,
  location: '',
  quantity: 0,
  inUseQuantity: 0,
  stockQuantity: 0,
})

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: t('material.enterName'), trigger: 'blur' }],
  type: [{ required: true, message: t('material.selectType'), trigger: 'change' }],
  location: [{ required: true, message: t('material.enterLocation'), trigger: 'blur' }],
}))

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  photoPreview.value = ''
  photoFile.value = undefined
  formData.name = ''
  formData.type = MaterialType.STUDIO
  formData.location = ''
  formData.quantity = 0
  formData.inUseQuantity = 0
  formData.stockQuantity = 0
}

// 监听 material 变化，填充表单
watch(
  () => props.material,
  (material) => {
    if (material) {
      formData.name = material.name
      formData.type = material.type
      formData.location = material.location
      formData.quantity = material.quantity
      formData.inUseQuantity = material.inUseQuantity
      formData.stockQuantity = material.stockQuantity
      photoPreview.value = ''
      photoFile.value = undefined
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// 处理照片选择
const handlePhotoChange = (file: UploadFile) => {
  if (file.raw) {
    photoFile.value = file.raw
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }
}

// 重新上传
const handleReupload = () => {
  // 触发文件选择
}

// 删除照片
const handleRemovePhoto = () => {
  photoPreview.value = ''
  photoFile.value = undefined
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

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
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      loading.value = false
    }
  })
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  resetForm()
}
</script>

<style scoped lang="scss">
.upload-container {
  width: 100%;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
    padding: 20px;
  }
}

.photo-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .photo-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.upload-text {
  text-align: center;

  p {
    margin: 0;
    font-size: 14px;
    color: #606266;
  }

  .upload-hint {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}
</style>
