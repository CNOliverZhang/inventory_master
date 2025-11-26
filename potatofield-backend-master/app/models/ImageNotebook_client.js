/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:08:18
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 21:27:20
 * @FilePath: /potatofield-backend/app/models/ImageNotebook_client.js
 * @Description: 
 */
module.exports = (sequelize, DataTypes) => sequelize.define('ImageNotebook_client', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  identifier: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'identifier',
    unique: 'identifier',
  },
  platform: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'platform',
  },
  versionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'version_id',
    references: {
      model: 'ImageNotebook_version',
      key: 'id',
    },
  },
  registerTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'register_time',
  },
}, {
  sequelize,
  tableName: 'ImageNotebook_client',
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
      name: 'identifier',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'identifier' },
      ],
    },
    {
      name: 'version_id',
      using: 'BTREE',
      fields: [
        { name: 'version_id' },
      ],
    },
  ],
});
