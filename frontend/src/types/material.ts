// 物资类型枚举
export enum MaterialType {
  STUDIO = 'studio',      // 工作室物料
  CLOTHING = 'clothing',  // 衣物
  MISC = 'misc'          // 杂物
}

// 物资类型标签映射
export const MaterialTypeLabels: Record<MaterialType, string> = {
  [MaterialType.STUDIO]: '工作室物料',
  [MaterialType.CLOTHING]: '衣物',
  [MaterialType.MISC]: '杂物',
}

// 物资接口
export interface Material {
  id: number
  name: string
  type: MaterialType
  location: string
  photoUrl?: string
  quantity?: number
  inUseQuantity?: number
  stockQuantity?: number
  createdAt: string
  updatedAt: string
}

// 创建物资表单
export interface MaterialForm {
  name: string
  type: MaterialType
  location: string
  photo?: File
  quantity?: number
  inUseQuantity?: number
  stockQuantity?: number
}

// 统计数据
export interface Statistics {
  total: number
  studio: number
  clothing: number
  misc: number
}
