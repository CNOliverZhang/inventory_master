import { MaterialType } from './material'

// 细分类别接口
export interface Category {
  id: number
  userId: number
  name: string
  type: MaterialType
  createdAt: string
  updatedAt: string
}

// 创建类别表单
export interface CategoryForm {
  name: string
  type: MaterialType
}

// 带统计的类别
export interface CategoryWithStats extends Category {
  materialCount: number
}
