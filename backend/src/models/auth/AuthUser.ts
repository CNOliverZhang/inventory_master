import { DataTypes, Model, Optional } from 'sequelize';
import userSequelize from '../../config/userDatabase';

// 用户属性接口
interface AuthUserAttributes {
  id: number;
  isAdmin: boolean;
  createdAt?: Date;
  lastLoginAt?: Date;
}

// 创建用户时的可选属性
interface AuthUserCreationAttributes extends Optional<AuthUserAttributes, 'id' | 'createdAt' | 'lastLoginAt'> {}

// AuthUser 模型类
class AuthUser extends Model<AuthUserAttributes, AuthUserCreationAttributes> implements AuthUserAttributes {
  public id!: number;
  public isAdmin!: boolean;
  public readonly createdAt!: Date;
  public lastLoginAt!: Date;
}

// 初始化模型
AuthUser.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_admin',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
    },
  },
  {
    sequelize: userSequelize,
    tableName: 'Auth_user',
    timestamps: false,
  }
);

export default AuthUser;
