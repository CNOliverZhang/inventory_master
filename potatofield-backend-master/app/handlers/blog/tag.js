const getPagination = require('../../utils/db_query/get_pagination');

module.exports = {
  list: async (ctx) => {
    const { Blog_tag } = ctx.db;
    try {
      const data = await Blog_tag.findAndCountAll({
        ...getPagination(ctx),
        order: [['name', 'ASC']],
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get blog article tag error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      name: { type: 'string', required: true },
    });
    const { Blog_tag } = ctx.db;
    const { name } = ctx.params;
    try {
      const homonymicTag = await Blog_tag.findOne({
        where: { name },
      });
      if (homonymicTag) {
        throw new Error('tag name collision');
      }
      const tag = await Blog_tag.create({ name });
      ctx.body = { success: true, tag };
    } catch (err) {
      ctx.throw(400, `Add blog article tag error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { Blog_tag } = ctx.db;
    const { id } = ctx.params;
    try {
      const tag = await Blog_tag.findOne({
        where: { id },
      });
      if (!tag) {
        throw new Error('tag not exists');
      }
      await tag.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove blog article tag error: ${err.message}.`);
    }
  },
};
