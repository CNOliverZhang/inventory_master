import request from './axios'
import type { Category, CategoryForm, CategoryWithStats } from '@/types/category'
import type { MaterialType } from '@/types/material'

// 获取类别列表
export const getCategoriesAPI = (type?: MaterialType) => {
  return request.get<Category[]>('/categories', {
    params: { type },
  })
}

// 获取类别详情
export const getCategoryAPI = (id: number) => {
  return request.get<Category>(`/categories/${id}`)
}

// 创建类别
export const createCategoryAPI = (data: CategoryForm) => {
  return request.post<Category>('/categories', data)
}

// 更新类别
export const updateCategoryAPI = (id: number, data: Partial<CategoryForm>) => {
  return request.put<Category>(`/categories/${id}`, data)
}

// 删除类别
export const deleteCategoryAPI = (id: number) => {
  return request.delete(`/categories/${id}`)
}

// 获取类别统计
export const getCategoryStatisticsAPI = () => {
  return request.get<CategoryWithStats[]>('/categories/statistics')
}
