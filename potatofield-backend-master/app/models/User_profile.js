module.exports = (sequelize, DataTypes) => sequelize.define('User_profile', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'user_id',
    references: {
      model: 'Auth_user',
      key: 'id',
    },
  },
  nickname: {
    type: DataTypes.STRING(32),
    allowNull: true,
    field: 'nickname',
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'avatar',
  },
  intro: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'intro',
  },
}, {
  sequelize,
  tableName: 'User_profile',
  timestamps: false,
  indexes: [
    {
      name: 'PRIMARY',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'user_id' },
      ],
    },
  ],
});
