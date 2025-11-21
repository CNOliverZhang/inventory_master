<template>
  <el-card class="material-card" shadow="hover">
    <div class="card-image">
      <img v-if="material.photoUrl" :src="material.photoUrl" :alt="material.name" />
      <div v-else class="default-icon">
        <el-icon :size="60" color="#1976D2">
          <component :is="getTypeIcon(material.type)" />
        </el-icon>
      </div>
    </div>

    <div class="card-content">
      <h3 class="material-name">{{ material.name }}</h3>
      
      <div class="material-info">
        <div class="info-item">
          <el-icon :size="14" color="#757575">
            <Location />
          </el-icon>
          <span>{{ material.location }}</span>
        </div>

        <div class="info-item">
          <el-tag :type="getTypeTagType(material.type)" size="small">
            {{ t(`material.${material.type}`) }}
          </el-tag>
        </div>
      </div>

      <!-- 数量信息 -->
      <div v-if="hasQuantity" class="quantity-info">
        <!-- 工作室物料：双数量 -->
        <template v-if="material.type === MaterialType.STUDIO">
          <div class="quantity-item">
            <span class="quantity-label">{{ t('material.inUseQuantity') }}:</span>
            <span class="quantity-value">{{ material.inUseQuantity || 0 }}</span>
          </div>
          <div class="quantity-item">
            <span class="quantity-label">{{ t('material.stockQuantity') }}:</span>
            <span class="quantity-value">{{ material.stockQuantity || 0 }}</span>
          </div>
        </template>
        <!-- 杂物：单数量 -->
        <template v-else-if="material.type === MaterialType.MISC">
          <div class="quantity-item">
            <span class="quantity-label">{{ t('material.quantity') }}:</span>
            <span class="quantity-value">{{ material.quantity || 0 }}</span>
          </div>
        </template>
      </div>
    </div>

    <div class="card-actions">
      <el-button type="primary" link :icon="Edit" @click="handleEdit">
        {{ t('common.edit') }}
      </el-button>
      <el-button type="danger" link :icon="Delete" @click="handleDelete">
        {{ t('common.delete') }}
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Material } from '@/types/material'
import { MaterialType } from '@/types/material'
import { Edit, Delete, Location, Briefcase, Handbag, Box } from '@element-plus/icons-vue'

interface Props {
  material: Material
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [material: Material]
  delete: [material: Material]
}>()

const { t } = useI18n()

// 是否显示数量信息
const hasQuantity = computed(() => {
  return props.material.type === MaterialType.STUDIO || props.material.type === MaterialType.MISC
})

// 获取类型图标
const getTypeIcon = (type: MaterialType) => {
  const icons = {
    [MaterialType.STUDIO]: Briefcase,
    [MaterialType.CLOTHING]: Handbag,
    [MaterialType.MISC]: Box,
  }
  return icons[type]
}

// 获取类型标签颜色
const getTypeTagType = (type: MaterialType) => {
  const types = {
    [MaterialType.STUDIO]: 'primary',
    [MaterialType.CLOTHING]: 'success',
    [MaterialType.MISC]: 'warning',
  }
  return types[type] as any
}

const handleEdit = () => {
  emit('edit', props.material)
}

const handleDelete = () => {
  emit('delete', props.material)
}
</script>

<style scoped lang="scss">
.material-card {
  position: relative;
  transition: all 0.3s;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }
}

.card-image {
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .default-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  }
}

.card-content {
  padding: 16px;
}

.material-name {
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.material-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #757575;
}

.quantity-info {
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.quantity-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.quantity-label {
  color: #757575;
}

.quantity-value {
  font-weight: 600;
  color: #1976d2;
  font-size: 16px;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 16px 16px;
}
</style>
