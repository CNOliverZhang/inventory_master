module.exports = (sequelize, DataTypes) => sequelize.define('RichTextEditor_theme', {
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
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'description',
  },
  styleSheet: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'style_sheet',
  },
}, {
  sequelize,
  tableName: 'RichTextEditor_theme',
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
