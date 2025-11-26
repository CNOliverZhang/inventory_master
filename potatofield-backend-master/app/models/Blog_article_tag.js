module.exports = (sequelize, DataTypes) => sequelize.define('Blog_article_tag', {
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    field: 'id',
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
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tag_id',
    references: {
      model: 'Blog_tag',
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'Blog_article_tag',
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
      name: 'article_tag',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'article_id' },
        { name: 'tag_id' },
      ],
    },
  ],
});
