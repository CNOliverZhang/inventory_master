const getPagination = require('../../utils/db_query/get_pagination');

module.exports = {
  list: async (ctx) => {
    const { FontLibrary_font_style } = ctx.db;
    try {
      const data = await FontLibrary_font_style.findAndCountAll({
        ...getPagination(ctx),
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get font style list error: ${err.message}.`);
    }
  },
};
