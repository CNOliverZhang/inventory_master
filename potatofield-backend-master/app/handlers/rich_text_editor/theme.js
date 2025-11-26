const getPagination = require('../../utils/db_query/get_pagination');

module.exports = {
  list: async (ctx) => {
    const { RichTextEditor_theme } = ctx.db;
    try {
      const rawData = await RichTextEditor_theme.findAndCountAll({
        ...getPagination(ctx),
      });
      ctx.body = {
        count: rawData.count,
        list: rawData.rows,
      };
    } catch (err) {
      ctx.throw(400, `Get theme list error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      description: { type: 'string', required: true },
      styleSheet: { type: 'string', required: true },
    });
    const { RichTextEditor_theme } = ctx.db;
    const {
      name, description, styleSheet,
    } = ctx.params;
    try {
      const data = await RichTextEditor_theme.create({
        name,
        description,
        styleSheet,
      });
      ctx.body = { success: true, message: data };
    } catch (err) {
      ctx.throw(400, `Add theme error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      description: { type: 'string', required: true },
      styleSheet: { type: 'string', required: true },
    });
    const { RichTextEditor_theme } = ctx.db;
    const {
      id, name, description, styleSheet,
    } = ctx.params;
    try {
      const data = await RichTextEditor_theme.findOne({
        where: { id },
      });
      if (!data) {
        throw new Error('theme not exists');
      }
      await data.update({
        name, description, styleSheet,
      });
      await data.reload();
      ctx.body = { success: true, message: data };
    } catch (err) {
      ctx.throw(400, `Update theme error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { RichTextEditor_theme } = ctx.db;
    const { id } = ctx.params;
    try {
      const data = await RichTextEditor_theme.findOne({
        where: { id },
      });
      if (!data) {
        throw new Error('theme not exists');
      }
      await data.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove theme error: ${err.message}.`);
    }
  },
};
