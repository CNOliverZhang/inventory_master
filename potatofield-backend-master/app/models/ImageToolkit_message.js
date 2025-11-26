module.exports = (sequelize, DataTypes) => sequelize.define('ImageToolkit_message', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'title',
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'text',
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'pub_date',
  },
}, {
  sequelize,
  tableName: 'ImageToolkit_message',
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
