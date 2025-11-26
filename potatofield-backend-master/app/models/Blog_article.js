module.exports = (sequelize, DataTypes) => sequelize.define('Blog_article', {
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
    unique: 'title',
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'subtitle',
  },
  coverImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'cover_image',
  },
  introduction: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'introduction',
  },
  publishTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'publish_time',
  },
  updateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'update_time',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'content',
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'category_id',
    references: {
      model: 'Blog_category',
      key: 'id',
    },
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'author_id',
    references: {
      model: 'Auth_user',
      key: 'id',
    },
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_published',
  },
}, {
  sequelize,
  tableName: 'Blog_article',
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
      name: 'title',
      unique: true,
      using: 'BTREE',
      fields: [
        { name: 'title' },
      ],
    },
    {
      name: 'author_id',
      using: 'BTREE',
      fields: [
        { name: 'author_id' },
      ],
    },
    {
      name: 'Blog_article_FK',
      using: 'BTREE',
      fields: [
        { name: 'category_id' },
      ],
    },
  ],
});
