module.exports = (sequelize, DataTypes) => sequelize.define('ImageToolkit_tool', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'name',
  },
  introduction: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'introduction',
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'image',
  },
}, {
  sequelize,
  tableName: 'ImageToolkit_tool',
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
  ],
});
