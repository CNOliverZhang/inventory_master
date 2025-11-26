const { DataTypes } = require('sequelize');
const _Auth_credential = require('./Auth_credential');
const _Auth_user = require('./Auth_user');
const _Blog_article = require('./Blog_article');
const _Blog_article_tag = require('./Blog_article_tag');
const _Blog_article_view_record = require('./Blog_article_view_record');
const _Blog_category = require('./Blog_category');
const _Blog_tag = require('./Blog_tag');
const _FontLibrary_font = require('./FontLibrary_font');
const _FontLibrary_font_family = require('./FontLibrary_font_family');
const _FontLibrary_font_style = require('./FontLibrary_font_style');
const _ImageToolkit_client = require('./ImageToolkit_client');
const _ImageToolkit_message = require('./ImageToolkit_message');
const _ImageToolkit_tool = require('./ImageToolkit_tool');
const _ImageToolkit_usage = require('./ImageToolkit_usage');
const _ImageToolkit_version = require('./ImageToolkit_version');
const _MediaCenter_file = require('./MediaCenter_file');
const _MediaCenter_file_tag = require('./MediaCenter_file_tag');
const _MediaCenter_tag = require('./MediaCenter_tag');
const _RichTextEditor_client = require('./RichTextEditor_client');
const _RichTextEditor_usage = require('./RichTextEditor_usage');
const _RichTextEditor_version = require('./RichTextEditor_version');
const _RichTextEditor_theme = require('./RichTextEditor_theme');
const _ImageNotebook_client = require('./ImageNotebook_client');
const _ImageNotebook_usage = require('./ImageNotebook_usage');
const _ImageNotebook_version = require('./ImageNotebook_version');
const _User_profile = require('./User_profile');

const initModels = (sequelize) => {
  const Auth_credential = _Auth_credential(sequelize, DataTypes);
  const Auth_user = _Auth_user(sequelize, DataTypes);
  const Blog_article = _Blog_article(sequelize, DataTypes);
  const Blog_article_tag = _Blog_article_tag(sequelize, DataTypes);
  const Blog_article_view_record = _Blog_article_view_record(sequelize, DataTypes);
  const Blog_category = _Blog_category(sequelize, DataTypes);
  const Blog_tag = _Blog_tag(sequelize, DataTypes);
  const FontLibrary_font = _FontLibrary_font(sequelize, DataTypes);
  const FontLibrary_font_family = _FontLibrary_font_family(sequelize, DataTypes);
  const FontLibrary_font_style = _FontLibrary_font_style(sequelize, DataTypes);
  const ImageToolkit_client = _ImageToolkit_client(sequelize, DataTypes);
  const ImageToolkit_message = _ImageToolkit_message(sequelize, DataTypes);
  const ImageToolkit_tool = _ImageToolkit_tool(sequelize, DataTypes);
  const ImageToolkit_usage = _ImageToolkit_usage(sequelize, DataTypes);
  const ImageToolkit_version = _ImageToolkit_version(sequelize, DataTypes);
  const MediaCenter_file = _MediaCenter_file(sequelize, DataTypes);
  const MediaCenter_file_tag = _MediaCenter_file_tag(sequelize, DataTypes);
  const MediaCenter_tag = _MediaCenter_tag(sequelize, DataTypes);
  const RichTextEditor_client = _RichTextEditor_client(sequelize, DataTypes);
  const RichTextEditor_usage = _RichTextEditor_usage(sequelize, DataTypes);
  const RichTextEditor_version = _RichTextEditor_version(sequelize, DataTypes);
  const RichTextEditor_theme = _RichTextEditor_theme(sequelize, DataTypes);
  const ImageNotebook_client = _ImageNotebook_client(sequelize, DataTypes);
  const ImageNotebook_usage = _ImageNotebook_usage(sequelize, DataTypes);
  const ImageNotebook_version = _ImageNotebook_version(sequelize, DataTypes);
  const User_profile = _User_profile(sequelize, DataTypes);

  // 用户相关
  Auth_credential.belongsTo(Auth_user, { as: 'user', foreignKey: 'userId' });
  Auth_user.hasMany(Auth_credential, { as: 'credentials', foreignKey: 'userId' });
  User_profile.belongsTo(Auth_user, { as: 'user', foreignKey: 'userId' });
  Auth_user.hasOne(User_profile, { as: 'profile', foreignKey: 'userId' });

  // 博客文章相关
  Blog_article.belongsTo(Auth_user, { as: 'author', foreignKey: 'authorId' });
  Auth_user.hasMany(Blog_article, { as: 'articles', foreignKey: 'authorId' });

  // 博客浏览记录相关
  Blog_article_view_record.belongsTo(Auth_user, { as: 'viewer', foreignKey: 'userId' });
  Auth_user.hasMany(Blog_article_view_record, { as: 'articleViewRecords', foreignKey: 'userId' });
  Blog_article_view_record.belongsTo(Blog_article, { as: 'article', foreignKey: 'articleId' });
  Blog_article.hasMany(Blog_article_view_record, { as: 'userViewRecords', foreignKey: 'articleId' });

  // 博客标签相关
  Blog_article.belongsToMany(Blog_tag, {
    as: 'tags',
    through: Blog_article_tag,
    foreignKey: 'articleId',
    otherKey: 'tagId',
  });
  Blog_tag.belongsToMany(Blog_article, {
    as: 'articles',
    through: Blog_article_tag,
    foreignKey: 'tagId',
    otherKey: 'articleId',
  });

  // 博客分类相关
  Blog_category.belongsTo(Blog_category, { as: 'parent', foreignKey: 'parentId', onDelete: 'SET NULL' });
  Blog_category.hasMany(Blog_category, { as: 'children', foreignKey: 'parentId' });
  Blog_article.belongsTo(Blog_category, { as: 'category', foreignKey: 'categoryId', onDelete: 'SET NULL' });
  Blog_category.hasMany(Blog_article, { as: 'articles', foreignKey: 'categoryId' });

  // 媒体中心用户相关
  MediaCenter_file.belongsTo(Auth_user, { as: 'uploadUser', foreignKey: 'uploadUserId' });
  Auth_user.hasMany(MediaCenter_file, { as: 'uploadedFiles', foreignKey: 'uploadUserId' });

  // 媒体中心标签相关
  MediaCenter_file.belongsToMany(MediaCenter_tag, {
    as: 'tags',
    through: MediaCenter_file_tag,
    foreignKey: 'fileId',
    otherKey: 'tagId',
  });
  MediaCenter_tag.belongsToMany(MediaCenter_file, {
    as: 'files',
    through: MediaCenter_file_tag,
    foreignKey: 'tagId',
    otherKey: 'fileId',
  });

  // 字体库相关
  FontLibrary_font.belongsTo(FontLibrary_font_family, { as: 'fontFamily', foreignKey: 'fontFamilyId', onDelete: 'CASCADE' });
  FontLibrary_font_family.hasMany(FontLibrary_font, { as: 'fonts', foreignKey: 'fontFamilyId' });
  FontLibrary_font.belongsTo(FontLibrary_font_style, { as: 'fontStyle', foreignKey: 'fontStyleId' });
  FontLibrary_font_style.hasMany(FontLibrary_font, { as: 'fonts', foreignKey: 'fontStyleId' });

  // 图像工具箱相关
  ImageToolkit_usage.belongsTo(ImageToolkit_client, { as: 'client', foreignKey: 'clientId' });
  ImageToolkit_client.hasMany(ImageToolkit_usage, { as: 'usages', foreignKey: 'clientId' });
  ImageToolkit_client.belongsTo(ImageToolkit_version, { as: 'version', foreignKey: 'versionId' });
  ImageToolkit_version.hasMany(ImageToolkit_client, { as: 'clients', foreignKey: 'versionId' });

  // 富文本编辑器相关
  RichTextEditor_usage.belongsTo(RichTextEditor_client, { as: 'client', foreignKey: 'clientId' });
  RichTextEditor_client.hasMany(RichTextEditor_usage, { as: 'usages', foreignKey: 'clientId' });
  RichTextEditor_client.belongsTo(RichTextEditor_version, { as: 'version', foreignKey: 'versionId' });
  RichTextEditor_version.hasMany(RichTextEditor_client, { as: 'clients', foreignKey: 'versionId' });

  // 图笔记本相关
  ImageNotebook_usage.belongsTo(ImageNotebook_client, { as: 'client', foreignKey: 'clientId' });
  ImageNotebook_client.hasMany(ImageNotebook_usage, { as: 'usages', foreignKey: 'clientId' });
  ImageNotebook_client.belongsTo(ImageNotebook_version, { as: 'version', foreignKey: 'versionId' });
  ImageNotebook_version.hasMany(ImageNotebook_client, { as: 'clients', foreignKey: 'versionId' });

  return {
    Auth_credential,
    Auth_user,
    Blog_article,
    Blog_article_tag,
    Blog_article_view_record,
    Blog_category,
    Blog_tag,
    FontLibrary_font,
    FontLibrary_font_family,
    FontLibrary_font_style,
    ImageToolkit_client,
    ImageToolkit_message,
    ImageToolkit_tool,
    ImageToolkit_usage,
    ImageToolkit_version,
    MediaCenter_file,
    MediaCenter_file_tag,
    MediaCenter_tag,
    RichTextEditor_theme,
    RichTextEditor_version,
    RichTextEditor_client,
    RichTextEditor_usage,
    ImageNotebook_version,
    ImageNotebook_client,
    ImageNotebook_usage,
    User_profile,
  };
};

module.exports = initModels;
