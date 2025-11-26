module.exports = (sequelize, DataTypes) => sequelize.define('FontLibrary_font_family', {
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
  language: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'language',
  },
}, {
  sequelize,
  tableName: 'FontLibrary_font_family',
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
