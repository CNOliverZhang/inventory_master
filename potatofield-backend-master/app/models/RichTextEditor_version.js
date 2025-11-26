module.exports = (sequelize, DataTypes) => sequelize.define('RichTextEditor_version', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  code: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'code',
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'features',
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'pub_date',
  },
  macBlockmap: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'mac_blockmap',
  },
  macPackage: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'mac_package',
  },
  macZipBlockmap: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'mac_zip_blockmap',
  },
  macZip: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'mac_zip',
  },
  winBlockmap: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'win_blockmap',
  },
  winPackage: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'win_package',
  },
}, {
  sequelize,
  tableName: 'RichTextEditor_version',
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
