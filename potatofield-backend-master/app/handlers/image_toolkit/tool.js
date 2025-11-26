const getPagination = require('../../utils/db_query/get_pagination');
const uploadToCos = require('../../utils/file/upload_to_cos');
const getBufferFromCos = require('../../utils/file/get_buffer_from_cos');
const deleteFromCos = require('../../utils/file/delete_from_cos');

module.exports = {
  list: async (ctx) => {
    const { ImageToolkit_tool } = ctx.db;
    try {
      const rawData = await ImageToolkit_tool.findAndCountAll({
        order: [
          ['name', 'ASC'],
        ],
        ...getPagination(ctx),
      });
      ctx.body = {
        count: rawData.count,
        list: rawData.rows,
      };
    } catch (err) {
      ctx.throw(400, `Get tool list error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      introduction: { type: 'string', required: true },
    });
    const { ImageToolkit_tool } = ctx.db;
    const { name, introduction } = ctx.params;
    const imageFile = ctx.request.files?.image;
    try {
      if (!imageFile) {
        throw new Error('no image file');
      }
      const homonymicTool = await ImageToolkit_tool.findOne({
        where: { name },
      });
      if (homonymicTool) {
        throw new Error('tool name collision');
      }
      if (imageFile.name.split('.').pop().toLowerCase() !== 'png') {
        throw new Error('image file type not allowed');
      }
      const image = await uploadToCos({ file: imageFile, key: `ImageToolkit/Tool/Images/${name}.png` });
      const data = await ImageToolkit_tool.create({ name, introduction, image });
      ctx.body = { success: true, tool: data };
    } catch (err) {
      ctx.throw(400, `Add tool error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      name: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    });
    const { ImageToolkit_tool } = ctx.db;
    const { id, name, introduction } = ctx.params;
    const imageFile = ctx.request.files?.image;
    try {
      const tool = await ImageToolkit_tool.findOne({
        where: { id },
      });
      if (!tool) {
        throw new Error('tool not exists');
      }
      if (imageFile && imageFile.name.split('.').pop().toLowerCase() !== 'png') {
        throw new Error('image file type not allowed');
      }
      if (name && name !== tool.name) {
        const homonymicTool = await ImageToolkit_tool.findOne({
          where: { name },
        });
        if (homonymicTool) {
          throw new Error('tool name collision');
        }
        await tool.update({ name });
        if (!imageFile) {
          const imageBuffer = await getBufferFromCos({ url: tool.image });
          const image = await uploadToCos({ buffer: imageBuffer, key: `ImageToolkit/Tool/Images/${name}.png` });
          await deleteFromCos({ url: tool.image });
          await tool.update({ image });
        }
      }
      if (imageFile) {
        await deleteFromCos({ url: tool.image });
        const image = await uploadToCos({ file: imageFile, key: `ImageToolkit/Tool/Images/${tool.name}.png` });
        await tool.update({ image });
      }
      if (introduction) {
        await tool.update({ introduction });
      }
      await tool.reload();
      ctx.body = { success: true, tool };
    } catch (err) {
      ctx.throw(400, `Update tool error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { ImageToolkit_tool } = ctx.db;
    const { id } = ctx.params;
    try {
      const tool = await ImageToolkit_tool.findOne({
        where: { id },
      });
      if (tool) {
        throw new Error('tool not exists');
      }
      await deleteFromCos({ url: tool.image });
      await tool.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove tool error: ${err.message}.`);
    }
  },
};
