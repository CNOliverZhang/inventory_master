const Sequelize = require('sequelize');
const getPagination = require('../../utils/db_query/get_pagination');
const getDescendantList = require('../../utils/db_query/get_descendant_list');
const getWechatAccessToken = require('../../utils/wechat/get_access_token');
const exportArticle = require('../../utils/wechat/export_article');

module.exports = {
  get: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { id } = ctx.params;
    const {
      Auth_user,
      Blog_tag,
      Blog_category,
      Blog_article,
      Blog_article_view_record,
    } = ctx.db;
    const { user } = ctx.request;
    try {
      const article = await Blog_article.findOne({
        where: { id },
        include: [
          {
            model: Auth_user,
            as: 'author',
            include: ['profile'],
          },
          {
            model: Blog_tag,
            as: 'tags',
          },
          {
            model: Blog_category,
            as: 'category',
          },
        ],
      });
      if (!article) {
        throw new Error('article not exists');
      }
      if (!article.isPublished && !user?.isAdmin) {
        throw new Error('article not exists');
      }
      if (user && user.id !== article.authorId) {
        await Blog_article_view_record.create({
          articleId: id,
          userId: user.id,
          viewTime: new Date(),
        });
      }
      const relevantArticles = [];
      if (article.toJSON().tags?.length) {
        const articlesWithSameTag = await Blog_article.findAll({
          include: [
            {
              model: Blog_tag,
              as: 'tags',
              where: {
                [Sequelize.Op.or]: article.toJSON().tags.map((tag) => Number(tag.id)),
              },
            },
          ],
          where: {
            id: {
              [Sequelize.Op.ne]: id,
            },
          },
          order: [Sequelize.literal('rand()')],
          limit: 5,
          distinct: true,
        });
        relevantArticles.push(...articlesWithSameTag.map((item) => item.toJSON()));
      }
      if (relevantArticles.length < 5) {
        const articlesWithSameCategory = await Blog_article.findAll({
          include: [
            {
              model: Blog_category,
              as: 'category',
              where: {
                id: article.toJSON()?.categoryId,
              },
            },
          ],
          where: {
            id: {
              [Sequelize.Op.ne]: id,
            },
          },
          order: [Sequelize.literal('rand()')],
          limit: 5 - relevantArticles.length,
          distinct: true,
        });
        relevantArticles.push(...articlesWithSameCategory.map((item) => item.toJSON()));
      }
      if (relevantArticles.length < 5) {
        const otherArticles = await Blog_article.findAll({
          where: {
            id: {
              [Sequelize.Op.ne]: id,
            },
          },
          order: [Sequelize.literal('rand()')],
          limit: 5 - relevantArticles.length,
          distinct: true,
        });
        relevantArticles.push(...otherArticles.map((item) => item.toJSON()));
      }
      const viewCount = await Blog_article.count(Blog_article_view_record);
      ctx.body = { ...article.toJSON(), viewCount, relevantArticles };
    } catch (err) {
      ctx.throw(400, `Get article error: ${err.message}.`);
    }
  },
  list: async (ctx) => {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      tagIdList: { type: 'array', required: false },
      categoryId: { type: 'number', required: false },
      authorId: { type: 'number', required: false },
      includeDraft: { type: 'boolean', required: false },
    });
    const {
      Auth_user,
      Blog_article,
      Blog_tag,
      Blog_category,
    } = ctx.db;
    const {
      title,
      tagIdList,
      categoryId,
      authorId,
      includeDraft,
    } = ctx.params;
    const { user } = ctx.request;
    try {
      const where = {};
      if (authorId) {
        where.authorId = authorId;
      }
      if (title) {
        where.title = {
          [Sequelize.Op.like]: `%${title || ''}%`,
        };
      }
      if (!user?.isAdmin || !includeDraft) {
        where.isPublished = true;
        where.publishTime = {
          [Sequelize.Op.lte]: new Date(),
        };
      }
      const tagWhere = {};
      if (tagIdList) {
        tagWhere.id = {
          [Sequelize.Op.or]: tagIdList.map((tag) => Number(tag)),
        };
      }
      if (categoryId) {
        const categoryIdList = await getDescendantList({
          model: Blog_category,
          id: categoryId,
          childrenAttrName: 'children',
        });
        where.categoryId = {
          [Sequelize.Op.or]: categoryIdList,
        };
      }
      const data = await Blog_article.findAndCountAll({
        ...getPagination(ctx),
        include: [
          {
            model: Auth_user,
            as: 'author',
            include: ['profile'],
          },
          {
            model: Blog_tag,
            as: 'tags',
            where: Object.keys(tagWhere).length ? tagWhere : undefined,
          },
          {
            model: Blog_category,
            as: 'category',
          },
        ],
        where,
        order: [['publishTime', 'DESC']],
        distinct: true,
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get article list error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      subtitle: { type: 'string', required: false },
      coverImage: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
      publishTime: { type: 'dateTime', required: false },
      content: { type: 'string', required: true },
      categoryId: { type: 'number', required: false },
      isPublished: { type: 'boolean', required: false },
    });
    const {
      title,
      subtitle = null,
      coverImage = null,
      introduction = null,
      publishTime,
      content,
      categoryId = null,
      isPublished = false,
    } = ctx.params;
    const { Blog_article, Blog_category } = ctx.db;
    const { id: authorId } = ctx.request.user;
    try {
      const homonymicArticle = await Blog_article.findOne({
        where: { title },
      });
      if (homonymicArticle) {
        throw new Error('article name collision');
      }
      if (categoryId) {
        const category = await Blog_category.findOne({ where: { id: categoryId } });
        if (!category) {
          throw new Error('category not exists');
        }
      }
      const now = new Date();
      const article = await Blog_article.create({
        title,
        subtitle,
        coverImage,
        introduction,
        publishTime: publishTime || now,
        updateTime: now,
        content,
        categoryId,
        authorId,
        isPublished,
      });
      ctx.body = {
        success: true,
        article,
      };
    } catch (err) {
      ctx.throw(400, `Add article error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      title: { type: 'string', required: true },
      subtitle: { type: 'string', required: false },
      coverImage: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
      publishTime: { type: 'dateTime', required: false },
      content: { type: 'string', required: true },
      categoryId: { type: 'number', required: false },
      isPublished: { type: 'boolean', required: false },
    });
    const {
      id,
      title,
      subtitle = null,
      coverImage = null,
      introduction = null,
      publishTime,
      content,
      categoryId = null,
      isPublished = false,
    } = ctx.params;
    const { Blog_article, Blog_category } = ctx.db;
    const { id: authorId } = ctx.request.user;
    try {
      const homonymicArticle = await Blog_article.findOne({
        where: { title },
      });
      if (homonymicArticle && homonymicArticle.id !== id) {
        throw new Error('article name collision');
      }
      if (categoryId) {
        const category = await Blog_category.findOne({ where: { id: categoryId } });
        if (!category) {
          throw new Error('category not exists');
        }
      }
      const now = new Date();
      const article = await Blog_article.findOne({ where: { id } });
      if (!article) {
        throw new Error('article not exists');
      }
      if (article.authorId !== authorId) {
        throw new Error('user not match');
      }
      await article.update({
        title,
        subtitle,
        coverImage,
        introduction,
        publishTime: publishTime || article.publishTime,
        updateTime: now,
        content,
        categoryId,
        isPublished,
      });
      await article.reload();
      ctx.body = {
        success: true,
        article,
      };
    } catch (err) {
      ctx.throw(400, `Update article error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { id } = ctx.params;
    const { Blog_article } = ctx.db;
    const { id: authorId } = ctx.request.user;
    try {
      const article = await Blog_article.findOne({ where: { id } });
      if (!article) {
        throw new Error('article not exists');
      }
      if (article.authorId !== authorId) {
        throw new Error('user not match');
      }
      await article.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove article error: ${err.message}.`);
    }
  },
  addTag: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      tagId: { type: 'number', required: true },
    });
    const { Blog_article, Blog_tag } = ctx.db;
    const { id: authorId } = ctx.request.user;
    const { id, tagId } = ctx.params;
    try {
      const article = await Blog_article.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!article) {
        throw new Error('article not exists');
      }
      if (article.authorId !== authorId) {
        throw new Error('user not match');
      }
      const tag = await Blog_tag.findOne({
        where: { id: tagId },
      });
      if (!tag) {
        throw new Error('tag not exists');
      }
      const hasThisTag = await article.hasTag(tag);
      if (hasThisTag) {
        throw new Error('this article already has this tag');
      }
      await article.addTag(tag);
      await article.reload();
      ctx.body = { success: true, article };
    } catch (err) {
      ctx.throw(400, `Add tag to blog article error: ${err.message}.`);
    }
  },
  removeTag: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      tagId: { type: 'number', required: true },
    });
    const { Blog_article, Blog_tag } = ctx.db;
    const { id: authorId } = ctx.request.user;
    const { id, tagId } = ctx.params;
    try {
      const article = await Blog_article.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!article) {
        throw new Error('article not exists');
      }
      if (article.authorId !== authorId) {
        throw new Error('user not match');
      }
      const tag = await Blog_tag.findOne({
        where: { id: tagId },
      });
      if (!tag) {
        throw new Error('tag not exists');
      }
      const hasThisTag = await article.hasTag(tag);
      if (!hasThisTag) {
        throw new Error('this aiticle doesn\'t have this tag');
      }
      await article.removeTag(tag);
      await article.reload();
      ctx.body = { success: true, article };
    } catch (err) {
      ctx.throw(400, `Remove tag from blog article error: ${err.message}.`);
    }
  },
  getTags: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { Blog_article } = ctx.db;
    const { id } = ctx.params;
    try {
      const article = await Blog_article.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!article) {
        throw new Error('article not exists');
      }
      ctx.body = { success: true, tags: article.tags };
    } catch (err) {
      ctx.throw(400, `Get blog article tags error: ${err.message}.`);
    }
  },
  clearTags: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { Blog_article } = ctx.db;
    const { id: authorId } = ctx.request.user;
    const { id } = ctx.params;
    try {
      const article = await Blog_article.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!article) {
        throw new Error('article not exists');
      }
      if (article.authorId !== authorId) {
        throw new Error('user not match');
      }
      await article.setTags([]);
      await article.reload();
      ctx.body = { success: true, article };
    } catch (err) {
      ctx.throw(400, `Clear tags from blog article error: ${err.message}.`);
    }
  },
  exportToWechat: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      content: { type: 'string', required: true },
    });
    const {
      Auth_user,
      Blog_tag,
      Blog_category,
      Blog_article,
    } = ctx.db;
    const { id, content } = ctx.params;
    try {
      const article = await Blog_article.findOne({
        where: { id },
        include: [
          {
            model: Auth_user,
            as: 'author',
            include: ['profile'],
          },
          {
            model: Blog_tag,
            as: 'tags',
          },
          {
            model: Blog_category,
            as: 'category',
          },
        ],
      });
      if (!article) {
        throw new Error('article not exists');
      }
      const accessToken = await getWechatAccessToken(ctx);
      exportArticle({ article, content, accessToken });
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Export to wechat error: ${err.message}.`);
    }
  },
};
