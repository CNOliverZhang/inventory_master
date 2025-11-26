module.exports = (sequelize, DataTypes) => sequelize.define('MediaCenter_file_tag', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  fileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'file_id',
    references: {
      model: 'MediaCenter_file',
      key: 'id',
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tag_id',
    references: {
      model: 'MediaCenter_tag',
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'MediaCenter_file_tag',
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
      name: 'file_tag',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'file_id' },
        { name: 'tag_id' },
      ],
    },
    {
      name: 'MediaCenter_file_tag_FK_1',
      using: 'BTREE',
      fields: [
        { name: 'tag_id' },
      ],
    },
  ],
});
