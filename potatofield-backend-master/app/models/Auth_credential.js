module.exports = (sequelize, DataTypes) => sequelize.define('Auth_credential', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'Auth_user',
      key: 'id',
    },
  },
  authType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'auth_type',
  },
  identifier: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'identifier',
    unique: 'identifier',
  },
  credential: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'credential',
  },
}, {
  sequelize,
  tableName: 'Auth_credential',
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
      name: 'credential',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'user_id' },
        { name: 'auth_type_id' },
      ],
    },
    {
      name: 'auth_type',
      using: 'BTREE',
      fields: [
        { name: 'auth_type' },
      ],
    },
  ],
});
