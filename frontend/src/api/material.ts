import request from './axios'
import type { Material, MaterialForm, Statistics, QuickActionType } from '@/types/material'

// API 响应格式
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

/**
 * 获取物资列表
 */
export const getMaterialsApi = (params?: {
  type?: string
  search?: string
}): Promise<ApiResponse<Material[]>> => {
  return request.get('/materials', { params })
}

/**
 * 获取物资详情
 */
export const getMaterialByIdApi = (id: number): Promise<ApiResponse<Material>> => {
  return request.get(`/materials/${id}`)
}

/**
 * 创建物资
 */
export const createMaterialApi = (data: MaterialForm): Promise<ApiResponse<Material>> => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('type', data.type)
  formData.append('location', data.location)
  
  // 添加细分类别ID
  if (data.categoryId !== undefined) {
    formData.append('categoryId', String(data.categoryId))
  }
  
  if (data.photo) {
    formData.append('photo', data.photo)
  }
  
  if (data.quantity !== undefined) {
    formData.append('quantity', String(data.quantity))
  }
  
  if (data.inUseQuantity !== undefined) {
    formData.append('inUseQuantity', String(data.inUseQuantity))
  }
  
  return request.post('/materials', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 更新物资
 */
export const updateMaterialApi = (
  id: number,
  data: Partial<MaterialForm>
): Promise<ApiResponse<Material>> => {
  const formData = new FormData()
  
  if (data.name) formData.append('name', data.name)
  if (data.location) formData.append('location', data.location)
  if (data.photo) formData.append('photo', data.photo)
  
  // 添加细分类别ID（允许设置为空）
  if (data.categoryId !== undefined) {
    formData.append('categoryId', String(data.categoryId))
  }
  
  if (data.quantity !== undefined) {
    formData.append('quantity', String(data.quantity))
  }
  
  if (data.inUseQuantity !== undefined) {
    formData.append('inUseQuantity', String(data.inUseQuantity))
  }
  
  return request.put(`/materials/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 删除物资
 */
export const deleteMaterialApi = (id: number): Promise<ApiResponse> => {
  return request.delete(`/materials/${id}`)
}

/**
 * 获取统计数据
 */
export const getStatisticsApi = (): Promise<ApiResponse<Statistics>> => {
  return request.get('/materials/statistics')
}

/**
 * 执行快捷操作
 */
export const performQuickAction = (
  id: number,
  action: QuickActionType,
  amount: number = 1
): Promise<ApiResponse<Material>> => {
  return request.post(`/materials/${id}/${action}`, { amount })
}
