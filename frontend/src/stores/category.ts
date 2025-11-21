import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, CategoryForm, CategoryWithStats } from '@/types/category'
import type { MaterialType } from '@/types/material'
import {
  getCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
  getCategoryStatisticsAPI,
} from '@/api/category'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

export const useCategoryStore = defineStore('category', () => {
  const { t } = useI18n()
  
  const categories = ref<Category[]>([])
  const categoryStats = ref<CategoryWithStats[]>([])
  const loading = ref(false)
  const currentType = ref<MaterialType | ''>('')

  // 根据类型过滤类别
  const filteredCategories = computed(() => {
    if (!currentType.value) return categories.value
    return categories.value.filter(cat => cat.type === currentType.value)
  })

  // 根据类型获取类别
  const getCategoriesByType = (type: MaterialType) => {
    return categories.value.filter(cat => cat.type === type)
  }

  // 获取类别列表
  const fetchCategories = async (type?: MaterialType) => {
    try {
      loading.value = true
      const res = await getCategoriesAPI(type)
      categories.value = res.data
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || t('common.error'))
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取类别统计
  const fetchCategoryStats = async () => {
    try {
      const res = await getCategoryStatisticsAPI()
      categoryStats.value = res.data
    } catch (error: any) {
      console.error('Failed to fetch category stats:', error)
    }
  }

  // 创建类别
  const createCategory = async (data: CategoryForm) => {
    try {
      loading.value = true
      await createCategoryAPI(data)
      ElMessage.success(t('category.createSuccess'))
      await fetchCategories()
      await fetchCategoryStats()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || t('common.error'))
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新类别
  const updateCategory = async (id: number, data: Partial<CategoryForm>) => {
    try {
      loading.value = true
      await updateCategoryAPI(id, data)
      ElMessage.success(t('category.updateSuccess'))
      await fetchCategories()
      await fetchCategoryStats()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || t('common.error'))
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除类别
  const deleteCategory = async (id: number) => {
    try {
      loading.value = true
      await deleteCategoryAPI(id)
      ElMessage.success(t('category.deleteSuccess'))
      await fetchCategories()
      await fetchCategoryStats()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || t('common.error'))
      throw error
    } finally {
      loading.value = false
    }
  }

  // 设置当前类型
  const setCurrentType = (type: MaterialType | '') => {
    currentType.value = type
  }

  return {
    categories,
    categoryStats,
    loading,
    currentType,
    filteredCategories,
    getCategoriesByType,
    fetchCategories,
    fetchCategoryStats,
    createCategory,
    updateCategory,
    deleteCategory,
    setCurrentType,
  }
})
