const getPagination = require('../../utils/db_query/get_pagination');

module.exports = {
  list: async (ctx) => {
    const { ImageToolkit_message } = ctx.db;
    try {
      const rawData = await ImageToolkit_message.findAndCountAll({
        order: [
          ['pubDate', 'DESC'],
        ],
        ...getPagination(ctx),
      });
      ctx.body = {
        count: rawData.count,
        list: rawData.rows,
      };
    } catch (err) {
      ctx.throw(400, `Get message list error: ${err.message}.`);
    }
  },
  latest: async (ctx) => {
    const { ImageToolkit_message } = ctx.db;
    try {
      const data = await ImageToolkit_message.findOne({
        order: [
          ['pubDate', 'DESC'],
        ],
      });
      ctx.body = data;
    } catch (err) {
      ctx.throw(400, `Get latest message error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      text: { type: 'string', required: true },
    });
    const { ImageToolkit_message } = ctx.db;
    const { title, text } = ctx.params;
    try {
      const data = await ImageToolkit_message.create({
        title,
        text,
        pubDate: new Date(),
      });
      ctx.body = { success: true, message: data };
    } catch (err) {
      ctx.throw(400, `Add message error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      title: { type: 'string', required: false },
      text: { type: 'string', required: false },
    });
    const { ImageToolkit_message } = ctx.db;
    const { id, title, text } = ctx.params;
    try {
      const data = await ImageToolkit_message.findOne({
        where: { id },
      });
      if (!data) {
        throw new Error('message not exists');
      }
      await data.update({ title, text });
      await data.reload();
      ctx.body = { success: true, message: data };
    } catch (err) {
      ctx.throw(400, `Update message error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { ImageToolkit_message } = ctx.db;
    const { id } = ctx.params;
    try {
      const data = await ImageToolkit_message.findOne({
        where: { id },
      });
      if (!data) {
        throw new Error('message not exists');
      }
      await data.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove message error: ${err.message}.`);
    }
  },
};
