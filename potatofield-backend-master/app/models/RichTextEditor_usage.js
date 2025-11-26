module.exports = (sequelize, DataTypes) => sequelize.define('RichTextEditor_usage', {
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
      model: 'RichTextEditor_client',
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'RichTextEditor_usage',
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
