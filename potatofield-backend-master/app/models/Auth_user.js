module.exports = (sequelize, DataTypes) => sequelize.define('Auth_user', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_admin',
  },
}, {
  sequelize,
  tableName: 'Auth_user',
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
