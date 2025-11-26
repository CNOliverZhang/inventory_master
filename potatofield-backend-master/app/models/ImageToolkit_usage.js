module.exports = (sequelize, DataTypes) => sequelize.define('ImageToolkit_usage', {
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
      model: 'ImageToolkit_client',
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'ImageToolkit_usage',
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
