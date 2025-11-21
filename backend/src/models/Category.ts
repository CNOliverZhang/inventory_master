import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { MaterialType } from './Material';

// 细分类别属性接口
interface CategoryAttributes {
  id: number;
  userId: number;              // 所属用户ID
  name: string;                // 类别名称
  type: MaterialType;          // 所属物资类型
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建类别时的可选属性
interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

// 导出接口供外部使用
export type { CategoryAttributes, CategoryCreationAttributes };

// Category 模型类
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public type!: MaterialType;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化模型
Category.init(
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
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '类别名称',
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MaterialType)),
      allowNull: false,
      comment: '所属物资类型',
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'type', 'name'],
        name: 'unique_user_type_name',
      },
    ],
  }
);

export default Category;
