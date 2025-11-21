import User from './User';
import Material from './Material';
import Category from './Category';

// 定义模型关联关系
User.hasMany(Material, {
  foreignKey: 'userId',
  as: 'materials',
});

Material.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Category, {
  foreignKey: 'userId',
  as: 'categories',
});

Category.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Category.hasMany(Material, {
  foreignKey: 'categoryId',
  as: 'materials',
});

Material.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

export { User, Material, Category };
