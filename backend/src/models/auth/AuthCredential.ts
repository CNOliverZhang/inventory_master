import { DataTypes, Model, Optional } from 'sequelize';
import userSequelize from '../../config/userDatabase';

// 认证类型枚举
export enum AuthType {
  USERNAME = 1,
  PHONE = 2,
  EMAIL = 3,
  WECHAT = 4,
  QQ = 5,
}

// 认证凭据属性接口
interface AuthCredentialAttributes {
  id: number;
  userId: number;
  authType: AuthType;
  identifier: string;
  credential: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建凭据时的可选属性
interface AuthCredentialCreationAttributes extends Optional<AuthCredentialAttributes, 'id' | 'credential' | 'createdAt' | 'updatedAt'> {}

// AuthCredential 模型类
class AuthCredential extends Model<AuthCredentialAttributes, AuthCredentialCreationAttributes> implements AuthCredentialAttributes {
  public id!: number;
  public userId!: number;
  public authType!: AuthType;
  public identifier!: string;
  public credential!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化模型
AuthCredential.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'Auth_user',
        key: 'id',
      },
    },
    authType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'auth_type',
    },
    identifier: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    credential: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize: userSequelize,
    tableName: 'Auth_credential',
    timestamps: false,
  }
);

export default AuthCredential;
