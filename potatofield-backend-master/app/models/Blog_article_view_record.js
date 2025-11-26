module.exports = (sequelize, DataTypes) => sequelize.define('Blog_article_view_record', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'article_id',
    references: {
      model: 'Blog_article',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'Auth_user',
      key: 'id',
    },
  },
  viewTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'view_time',
  },
}, {
  sequelize,
  tableName: 'Blog_article_view_record',
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
      name: 'Blog_article_view_record_FK',
      using: 'BTREE',
      fields: [
        { name: 'article_id' },
      ],
    },
    {
      name: 'Blog_article_view_record_FK_1',
      using: 'BTREE',
      fields: [
        { name: 'user_id' },
      ],
    },
  ],
});
