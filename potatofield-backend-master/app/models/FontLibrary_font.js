module.exports = (sequelize, DataTypes) => sequelize.define('FontLibrary_font', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  fontFamilyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'font_family_id',
    references: {
      model: 'FontLibrary_font_family',
      key: 'id',
    },
  },
  fontStyleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'font_style_id',
    references: {
      model: 'FontLibrary_font_style',
      key: 'id',
    },
  },
  fontFile: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'font_file',
  },
  previewImage: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'preview_image',
  },
}, {
  sequelize,
  tableName: 'FontLibrary_font',
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
      name: 'font_family_id',
      using: 'BTREE',
      fields: [
        { name: 'font_family_id' },
      ],
    },
    {
      name: 'font_style_id',
      using: 'BTREE',
      fields: [
        { name: 'font_style_id' },
      ],
    },
  ],
});
