import request from './axios'
import type { Category, CategoryForm, CategoryWithStats } from '@/types/category'
import type { MaterialType } from '@/types/material'

// 获取类别列表
export const getCategoriesAPI = (type?: MaterialType) => {
  return request.get<Category[]>('/api/categories', {
    params: { type },
  })
}

// 获取类别详情
export const getCategoryAPI = (id: number) => {
  return request.get<Category>(`/api/categories/${id}`)
}

// 创建类别
export const createCategoryAPI = (data: CategoryForm) => {
  return request.post<Category>('/api/categories', data)
}

// 更新类别
export const updateCategoryAPI = (id: number, data: Partial<CategoryForm>) => {
  return request.put<Category>(`/api/categories/${id}`, data)
}

// 删除类别
export const deleteCategoryAPI = (id: number) => {
  return request.delete(`/api/categories/${id}`)
}

// 获取类别统计
export const getCategoryStatisticsAPI = () => {
  return request.get<CategoryWithStats[]>('/api/categories/statistics')
}
