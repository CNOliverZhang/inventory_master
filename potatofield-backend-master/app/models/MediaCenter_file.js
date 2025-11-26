module.exports = (sequelize, DataTypes) => sequelize.define('MediaCenter_file', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'name',
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'url',
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'thumbnail',
  },
  uploadTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'upload_time',
  },
  uploadUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'upload_user_id',
    references: {
      model: 'Auth_user',
      key: 'id',
    },
  },
  mimeType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'mime_type',
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'metadata',
  },
}, {
  sequelize,
  tableName: 'MediaCenter_file',
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
      name: 'MediaCenter_file_FK',
      using: 'BTREE',
      fields: [
        { name: 'upload_user_id' },
      ],
    },
  ],
});
