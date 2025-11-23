// 物资类型枚举
export enum MaterialType {
  MISC = 'misc',              // 杂物
  CLOTHING = 'clothing',      // 衣物
  COLLECTIBLE = 'collectible' // 收藏品
}

// 物资类型标签映射
export const MaterialTypeLabels: Record<MaterialType, string> = {
  [MaterialType.MISC]: '杂物',
  [MaterialType.CLOTHING]: '衣物',
  [MaterialType.COLLECTIBLE]: '收藏品',
}

// 物资接口
export interface Material {
  id: number
  name: string
  type: MaterialType
  categoryId?: number
  category?: {
    id: number
    name: string
    type: MaterialType
  }
  location: string
  photoUrl?: string
  quantity?: number           // 总数量
  inUseQuantity?: number      // 在用数量（杂物使用）
  description?: string        // 详细信息（收藏品使用）
  createdAt: string
  updatedAt: string
}

// 创建物资表单
export interface MaterialForm {
  name: string
  type: MaterialType
  categoryId?: number | null
  location: string
  photo?: File
  quantity?: number
  inUseQuantity?: number
  description?: string
}

// 统计数据
export interface Statistics {
  total: number
  misc: number
  clothing: number
  collectible: number
}

// 快捷操作类型
export type QuickActionType = 'restock' | 'take-out' | 'discard' | 'replace'
