const getPagination = require('../../utils/db_query/get_pagination');

module.exports = {
  list: async (ctx) => {
    const { MediaCenter_tag } = ctx.db;
    try {
      const data = await MediaCenter_tag.findAndCountAll({
        ...getPagination(ctx),
        order: [['name', 'ASC']],
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get media tag list error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      name: { type: 'string', required: true },
    });
    const { MediaCenter_tag } = ctx.db;
    const { name } = ctx.params;
    try {
      const homonymicTag = await MediaCenter_tag.findOne({
        where: { name },
      });
      if (homonymicTag) {
        throw new Error('tag name collision');
      }
      const tag = await MediaCenter_tag.create({ name });
      ctx.body = { success: true, tag };
    } catch (err) {
      ctx.throw(400, `Add media tag error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { MediaCenter_tag } = ctx.db;
    const { id } = ctx.params;
    try {
      const tag = await MediaCenter_tag.findOne({
        where: { id },
      });
      if (!tag) {
        throw new Error('tag not exists');
      }
      await tag.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove media tag error: ${err.message}.`);
    }
  },
};
