module.exports = (sequelize, DataTypes) => sequelize.define('MediaCenter_tag', {
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
  tableName: 'MediaCenter_tag',
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
