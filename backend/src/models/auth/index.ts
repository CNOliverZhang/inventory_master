import AuthUser from './AuthUser';
import AuthCredential from './AuthCredential';
import UserProfile from './UserProfile';

// 设置模型关联
AuthUser.hasMany(AuthCredential, { foreignKey: 'userId', as: 'credentials' });
AuthCredential.belongsTo(AuthUser, { foreignKey: 'userId', as: 'user' });

AuthUser.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
UserProfile.belongsTo(AuthUser, { foreignKey: 'userId', as: 'user' });

export { AuthUser, AuthCredential, UserProfile };
export { AuthType } from './AuthCredential';
