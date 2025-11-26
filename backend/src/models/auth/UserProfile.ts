import { DataTypes, Model, Optional } from 'sequelize';
import userSequelize from '../../config/userDatabase';

// 用户资料属性接口
interface UserProfileAttributes {
  userId: number;
  nickname: string | null;
  avatar: string | null;
  intro: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// 创建资料时的可选属性
interface UserProfileCreationAttributes extends Optional<UserProfileAttributes, 'nickname' | 'avatar' | 'intro' | 'createdAt' | 'updatedAt'> {}

// UserProfile 模型类
class UserProfile extends Model<UserProfileAttributes, UserProfileCreationAttributes> implements UserProfileAttributes {
  public userId!: number;
  public nickname!: string | null;
  public avatar!: string | null;
  public intro!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 初始化模型
UserProfile.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'user_id',
      references: {
        model: 'Auth_user',
        key: 'id',
      },
    },
    nickname: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    intro: {
      type: DataTypes.TEXT,
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
    tableName: 'User_profile',
    timestamps: false,
  }
);

export default UserProfile;
