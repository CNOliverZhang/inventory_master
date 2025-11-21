import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Material, MaterialForm, MaterialType, Statistics } from '@/types/material'
import {
  getMaterialsApi,
  getMaterialByIdApi,
  createMaterialApi,
  updateMaterialApi,
  deleteMaterialApi,
  getStatisticsApi,
} from '@/api/material'
import { ElMessage } from 'element-plus'

export const useMaterialStore = defineStore('material', () => {
  // 状态
  const materials = ref<Material[]>([])
  const currentMaterial = ref<Material | null>(null)
  const statistics = ref<Statistics>({
    total: 0,
    studio: 0,
    clothing: 0,
    misc: 0,
  })
  const loading = ref(false)
  const currentType = ref<MaterialType | ''>('')
  const currentCategoryId = ref<number | null>(null)
  const searchKeyword = ref('')

  // 计算属性：过滤后的物资列表
  const filteredMaterials = computed(() => {
    let result = materials.value

    // 按类型筛选
    if (currentType.value) {
      result = result.filter((m) => m.type === currentType.value)
    }

    // 按细分类别筛选
    if (currentCategoryId.value !== null) {
      result = result.filter((m) => m.categoryId === currentCategoryId.value)
    }

    // 按关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter((m) => m.name.toLowerCase().includes(keyword))
    }

    return result
  })

  // 获取物资列表
  const fetchMaterials = async (params?: { type?: string; search?: string }) => {
    loading.value = true
    try {
      const res = await getMaterialsApi(params)
      materials.value = res.data
    } catch (error) {
      console.error('获取物资列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取物资详情
  const fetchMaterialById = async (id: number) => {
    loading.value = true
    try {
      const res = await getMaterialByIdApi(id)
      currentMaterial.value = res.data
      return res.data
    } catch (error) {
      console.error('获取物资详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建物资
  const createMaterial = async (data: MaterialForm) => {
    loading.value = true
    try {
      const res = await createMaterialApi(data)
      ElMessage.success(res.message || '创建成功')
      await fetchMaterials()
      await fetchStatistics()
      return res.data
    } catch (error) {
      console.error('创建物资失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新物资
  const updateMaterial = async (id: number, data: Partial<MaterialForm>) => {
    loading.value = true
    try {
      const res = await updateMaterialApi(id, data)
      ElMessage.success(res.message || '更新成功')
      await fetchMaterials()
      await fetchStatistics()
      return res.data
    } catch (error) {
      console.error('更新物资失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除物资
  const deleteMaterial = async (id: number) => {
    loading.value = true
    try {
      const res = await deleteMaterialApi(id)
      ElMessage.success(res.message || '删除成功')
      await fetchMaterials()
      await fetchStatistics()
    } catch (error) {
      console.error('删除物资失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const res = await getStatisticsApi()
      statistics.value = res.data
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  // 设置当前类型筛选
  const setCurrentType = (type: MaterialType | '') => {
    currentType.value = type
    // 切换类型时清空类别筛选
    currentCategoryId.value = null
  }

  // 设置当前类别筛选
  const setCurrentCategoryId = (categoryId: number | null) => {
    currentCategoryId.value = categoryId
  }

  // 设置搜索关键词
  const setSearchKeyword = (keyword: string) => {
    searchKeyword.value = keyword
  }

  return {
    // 状态
    materials,
    currentMaterial,
    statistics,
    loading,
    currentType,
    currentCategoryId,
    searchKeyword,
    filteredMaterials,
    // 方法
    fetchMaterials,
    fetchMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    fetchStatistics,
    setCurrentType,
    setCurrentCategoryId,
    setSearchKeyword,
  }
})
