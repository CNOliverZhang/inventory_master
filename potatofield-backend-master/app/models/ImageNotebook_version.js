/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:08:18
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 20:11:08
 * @FilePath: /potatofield-backend/app/models/ImageNotebook_version.js
 * @Description: 
 */
module.exports = (sequelize, DataTypes) => sequelize.define('ImageNotebook_version', {
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
  tableName: 'ImageNotebook_version',
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
