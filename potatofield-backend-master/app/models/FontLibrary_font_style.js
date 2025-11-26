module.exports = (sequelize, DataTypes) => sequelize.define('FontLibrary_font_style', {
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
}, {
  sequelize,
  tableName: 'FontLibrary_font_style',
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
  ],
});
