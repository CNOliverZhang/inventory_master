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
        <span class="type-tag px-2 sm:px-3 py-1 rounded-md text-xs font-medium text-white">
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
        <span class="category-tag inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs">
          <i class="pi pi-tag"></i>
          {{ material.category.name }}
        </span>
      </div>

      <!-- 位置信息 -->
      <div class="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 mb-3">
        <i class="pi pi-map-marker location-icon"></i>
        <span class="truncate">{{ material.location }}</span>
      </div>

      <!-- 数量信息 -->
      <div v-if="hasQuantity" class="space-y-1.5 mb-3 sm:mb-4">
        <!-- 杂物：双数量 -->
        <template v-if="material.type === MaterialType.STUDIO">
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-600">{{ t('material.inUseQuantity') }}</span>
            <span class="quantity-value font-semibold">{{ material.inUseQuantity || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-600">{{ t('material.stockQuantity') }}</span>
            <span class="quantity-value font-semibold">{{ stockQuantity }}</span>
          </div>
        </template>
        <!-- 收藏品：单数量 -->
        <template v-else-if="material.type === MaterialType.MISC">
          <div class="flex justify-between items-center text-xs sm:text-sm">
            <span class="text-gray-600">{{ t('material.quantity') }}</span>
            <span class="quantity-value font-semibold">{{ material.quantity || 0 }}</span>
          </div>
        </template>
      </div>

      <!-- 操作按钮 -->
      <div class="mt-auto flex gap-2">
        <!-- 杂物显示快捷操作按钮 -->
        <template v-if="material.type === MaterialType.STUDIO">
          <div class="relative flex-1" ref="quickActionsRef">
            <button
              @click="toggleQuickActions"
              class="btn-gradient w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-lg flex items-center justify-center gap-1"
            >
              <i class="pi pi-bolt"></i>
              <span class="hidden sm:inline">{{ t('material.quickActions') }}</span>
              <i :class="showQuickActions ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="text-xs"></i>
            </button>
            
            <!-- 快捷操作下拉菜单 -->
            <div
              v-if="showQuickActions"
              class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
            >
              <button
                @click="handleQuickAction('restock')"
                class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <i class="pi pi-plus-circle text-green-600"></i>
                {{ t('material.restock') }}
              </button>
              <button
                @click="handleQuickAction('take-out')"
                :disabled="!canTakeOut"
                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                :class="canTakeOut ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed'"
              >
                <i class="pi pi-arrow-circle-up text-blue-600"></i>
                {{ t('material.takeOut') }}
              </button>
              <button
                @click="handleQuickAction('discard')"
                :disabled="!canDiscard"
                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                :class="canDiscard ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed'"
              >
                <i class="pi pi-times-circle text-orange-600"></i>
                {{ t('material.discard') }}
              </button>
              <button
                @click="handleQuickAction('replace')"
                :disabled="!canReplace"
                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                :class="canReplace ? 'text-gray-700' : 'text-gray-400 cursor-not-allowed'"
              >
                <i class="pi pi-refresh text-purple-600"></i>
                {{ t('material.replace') }}
              </button>
            </div>
          </div>
        </template>
        
        <!-- 其他类型显示编辑按钮 -->
        <button
          v-if="material.type !== MaterialType.STUDIO"
          @click="handleEdit"
          class="btn-gradient flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-lg flex items-center justify-center gap-1"
        >
          <i class="pi pi-pencil"></i>
          <span class="hidden sm:inline">{{ t('common.edit') }}</span>
        </button>
        
        <!-- 删除按钮（所有类型都有） -->
        <button
          @click="handleDelete"
          class="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-lg flex items-center justify-center gap-1"
        >
          <i class="pi pi-trash"></i>
          <span class="hidden sm:inline">{{ t('common.delete') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Material, QuickActionType } from '@/types/material'
import { MaterialType } from '@/types/material'
import { performQuickAction } from '@/api/material'
import { useToast } from 'primevue/usetoast'

interface Props {
  material: Material
}

const props = defineProps<Props>()
const emit = defineEmits(['edit', 'delete', 'refresh'])

const { t } = useI18n()
const toast = useToast()

// 快捷操作状态
const showQuickActions = ref(false)
const quickActionsRef = ref<HTMLElement | null>(null)

// 是否显示数量信息
const hasQuantity = computed(() => {
  return props.material.type === MaterialType.STUDIO || props.material.type === MaterialType.MISC
})

// 快捷操作按钮启用状态
const stockQuantity = computed(() => {
  return (props.material.quantity || 0) - (props.material.inUseQuantity || 0)
})

const canTakeOut = computed(() => {
  return (props.material.inUseQuantity || 0) < (props.material.quantity || 0)
})

const canDiscard = computed(() => {
  return (props.material.inUseQuantity || 0) > 0 && (props.material.quantity || 0) > 0
})

const canReplace = computed(() => {
  return stockQuantity.value > 0
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

// 切换快捷操作菜单
const toggleQuickActions = () => {
  showQuickActions.value = !showQuickActions.value
}

// 处理快捷操作
const handleQuickAction = async (action: QuickActionType) => {
  showQuickActions.value = false
  
  try {
    let amount = 1
    
    // 如果是补充库存，弹出输入框
    if (action === 'restock') {
      const input = prompt(t('material.restockPrompt'), '1')
      if (input === null) return // 用户取消
      amount = parseInt(input)
      if (isNaN(amount) || amount <= 0) {
        toast.add({
          severity: 'error',
          summary: t('common.error'),
          detail: t('material.invalidAmount'),
          life: 3000
        })
        return
      }
    }
    
    await performQuickAction(props.material.id, action, amount)
    
    toast.add({
      severity: 'success',
      summary: t('common.success'),
      detail: t(`material.${action}Success`),
      life: 3000
    })
    
    // 刷新物资列表
    emit('refresh')
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: error.response?.data?.message || t('common.operationFailed'),
      life: 3000
    })
  }
}

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  if (quickActionsRef.value && !quickActionsRef.value.contains(event.target as Node)) {
    showQuickActions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleEdit = () => {
  emit('edit', props.material)
}

const handleDelete = () => {
  emit('delete', props.material)
}
</script>

<style scoped>
.type-tag {
  background: linear-gradient(to right, var(--color-primary-from), var(--color-primary-to));
}

.category-tag {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary-to);
}

.location-icon {
  color: var(--color-primary-to);
}

.quantity-value {
  color: var(--color-primary-to);
}
</style>
