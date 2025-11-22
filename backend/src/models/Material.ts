import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// 物资类型枚举
export enum MaterialType {
  STUDIO = 'studio',      // 杂物（原工作室物料）
  CLOTHING = 'clothing',  // 衣物
  MISC = 'misc'          // 收藏品（原杂物）
}

// 物资属性接口
interface MaterialAttributes {
  id: number;
  userId: number;              // 所属用户ID
  name: string;
  type: MaterialType;
  categoryId?: number;         // 细分类别ID（可选）
  location: string;
  photoUrl?: string;
  quantity?: number;           // 总数量（杂物使用）
  inUseQuantity?: number;      // 在用数量（杂物使用）
  description?: string;        // 详细信息（收藏品使用）
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建物资时的可选属性
interface MaterialCreationAttributes extends Optional<MaterialAttributes, 'id' | 'categoryId' | 'photoUrl' | 'quantity' | 'inUseQuantity' | 'description'> {}

// 导出接口供外部使用
export type { MaterialAttributes, MaterialCreationAttributes };

// Material 模型类
class Material extends Model<MaterialAttributes, MaterialCreationAttributes> implements MaterialAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public type!: MaterialType;
  public categoryId?: number;
  public location!: string;
  public photoUrl?: string;
  public quantity?: number;
  public inUseQuantity?: number;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化模型
Material.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '所属用户ID',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MaterialType)),
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '细分类别ID',
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '总数量（杂物使用）',
    },
    inUseQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '在用数量（杂物使用）',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '详细信息（收藏品使用）',
    },
  },
  {
    sequelize,
    tableName: 'materials',
    timestamps: true,
    underscored: true,
  }
);

export default Material;
