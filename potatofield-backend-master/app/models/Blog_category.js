module.exports = (sequelize, DataTypes) => sequelize.define('Blog_category', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    field: 'name',
    unique: 'name',
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_id',
    references: {
      model: 'Blog_category',
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'Blog_category',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'id' },
      ],
    },
    {
      name: 'name',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'name' },
      ],
    },
    {
      name: 'Blog_category_FK',
      using: 'BTREE',
      fields: [
        { name: 'parent_id' },
      ],
    },
  ],
});
