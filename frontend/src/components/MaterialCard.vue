<template>
  <div class="glass-card-hover p-3 sm:p-4 flex flex-col h-full">
    <!-- 图片区域 -->
    <div class="relative w-full h-36 sm:h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-3">
      <img
        v-if="material.photoUrl"
        :src="material.photoUrl"
        :alt="material.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i :class="getTypeIcon(material.type)" class="text-5xl sm:text-6xl text-gray-400"></i>
      </div>
      
      <!-- 类型标签 -->
      <div class="absolute top-2 left-2">
        <span :class="getTypeTagClass(material.type)" class="px-2 sm:px-3 py-1 rounded-md text-xs font-medium">
          {{ t(`material.${material.type}`) }}
        </span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 flex flex-col">
      <!-- 标题 -->
      <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-2 truncate">
        {{ material.name }}
      </h3>

      <!-- 类别标签 -->
      <div v-if="material.category" class="mb-2">
        <span class="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 text-cyan-700 rounded-md text-xs">
          <i class="pi pi-tag"></i>
          {{ material.category.name }}
        </span>
      </div>

      <!-- 位置信息 -->
      <div class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 mb-3">
        <i class="pi pi-map-marker text-cyan-500"></i>
        <span class="truncate">{{ material.location }}</span>
      </div>

      <!-- 数量信息 -->
      <div v-if="hasQuantity" class="space-y-1.5 mb-3 sm:mb-4">
        <!-- 工作室物料：双数量 -->
        <template v-if="material.type === MaterialType.STUDIO">
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-600">{{ t('material.inUseQuantity') }}</span>
            <span class="font-semibold text-cyan-600">{{ material.inUseQuantity || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-600">{{ t('material.stockQuantity') }}</span>
            <span class="font-semibold text-blue-600">{{ material.stockQuantity || 0 }}</span>
          </div>
        </template>
        <!-- 杂物：单数量 -->
        <template v-else-if="material.type === MaterialType.MISC">
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-600">{{ t('material.quantity') }}</span>
            <span class="font-semibold text-cyan-600">{{ material.quantity || 0 }}</span>
          </div>
        </template>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-auto flex gap-2">
        <button
          @click="handleEdit"
          class="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-md flex items-center justify-center gap-1"
        >
          <i class="pi pi-pencil"></i>
          <span class="hidden sm:inline">{{ t('common.edit') }}</span>
        </button>
        <button
          @click="handleDelete"
          class="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-md flex items-center justify-center gap-1"
        >
          <i class="pi pi-trash"></i>
          <span class="hidden sm:inline">{{ t('common.delete') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Material } from '@/types/material'
import { MaterialType } from '@/types/material'

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
    [MaterialType.STUDIO]: 'pi pi-briefcase',
    [MaterialType.CLOTHING]: 'pi pi-shopping-bag',
    [MaterialType.MISC]: 'pi pi-box',
  }
  return icons[type]
}

// 获取类型标签样式
const getTypeTagClass = (type: MaterialType) => {
  const classes = {
    [MaterialType.STUDIO]: 'bg-blue-500 text-white',
    [MaterialType.CLOTHING]: 'bg-green-500 text-white',
    [MaterialType.MISC]: 'bg-orange-500 text-white',
  }
  return classes[type]
}

const handleEdit = () => {
  emit('edit', props.material)
}

const handleDelete = () => {
  emit('delete', props.material)
}
</script>
