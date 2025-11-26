/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:08:18
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 20:10:20
 * @FilePath: /potatofield-backend/app/models/ImageNotebook_usage.js
 * @Description: 
 */
module.exports = (sequelize, DataTypes) => sequelize.define('ImageNotebook_usage', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'time',
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'client_id',
    references: {
      model: 'ImageNotebook_client',
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'ImageNotebook_usage',
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
      name: 'client_id',
      using: 'BTREE',
      fields: [
        { name: 'client_id' },
      ],
    },
  ],
});
