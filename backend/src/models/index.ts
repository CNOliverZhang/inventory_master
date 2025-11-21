import User from './User';
import Material from './Material';

// 定义模型关联关系
User.hasMany(Material, {
  foreignKey: 'userId',
  as: 'materials',
});

Material.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export { User, Material };
