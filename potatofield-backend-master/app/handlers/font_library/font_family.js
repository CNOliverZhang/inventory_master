const Sequelize = require('sequelize');
const opentype = require('opentype.js');
const { createCanvas } = require('canvas');

const uploadToCos = require('../../utils/file/upload_to_cos');
const batchDeleteFromCos = require('../../utils/file/batch_delete_from_cos');
const getBufferFromCos = require('../../utils/file/get_buffer_from_cos');
const refreshCdnFile = require('../../utils/file/refresh_cdn_file');
const getPagination = require('../../utils/db_query/get_pagination');

module.exports = {
  list: async (ctx) => {
    ctx.verifyParams({
      language: { type: 'number', required: false },
      name: { type: 'string', required: false },
    });
    const { language, name } = ctx.params;
    const { FontLibrary_font, FontLibrary_font_family, FontLibrary_font_style } = ctx.db;
    try {
      const where = {};
      if (name) {
        where.name = { [Sequelize.Op.like]: `%${name}%` };
      }
      if (language) {
        where.language = language;
      }
      const data = await FontLibrary_font_family.findAndCountAll({
        include: [
          {
            model: FontLibrary_font,
            as: 'fonts',
            include: [
              {
                model: FontLibrary_font_style,
                as: 'fontStyle',
              },
            ],
            order: [['name', 'ASC']],
          },
        ],
        order: [
          [
            'name',
            'ASC',
          ],
        ],
        distinct: true,
        where,
        ...getPagination(ctx),
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get font family list error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      language: { type: 'number', required: true },
      name: { type: 'string', required: true },
    });
    const { language, name } = ctx.params;
    const { FontLibrary_font_family } = ctx.db;
    try {
      const homonymicFontFamily = await FontLibrary_font_family.findOne({ where: { name } });
      if (homonymicFontFamily) {
        throw new Error('font family name already exists');
      }
      const fontFamily = await FontLibrary_font_family.create({ name, language });
      ctx.body = {
        success: true,
        fontFamily,
      };
    } catch (err) {
      ctx.throw(400, `Add font family error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      name: { type: 'string', required: false },
      language: { type: 'number', required: false },
    });
    const { language, name, id } = ctx.params;
    const { FontLibrary_font, FontLibrary_font_family, FontLibrary_font_style } = ctx.db;
    try {
      const fontFamilyInstance = await FontLibrary_font_family.findOne({
        where: { id },
        include: [
          {
            model: FontLibrary_font,
            as: 'fonts',
            include: [
              {
                model: FontLibrary_font_style,
                as: 'fontStyle',
              },
            ],
            order: [['name', 'ASC']],
          },
        ],
      });
      if (!fontFamilyInstance) {
        throw new Error('font family not exists');
      }
      if (name && name !== fontFamilyInstance.name) {
        const homonymicFontFamily = await FontLibrary_font_family.findOne({
          where: {
            name,
          },
        });
        if (homonymicFontFamily) {
          throw new Error('font family name collision');
        }
        for (const fontInstance of fontFamilyInstance.fonts) {
          const fontStyleName = fontInstance.fontStyle.name;
          const fontBuffer = await getBufferFromCos({ url: fontInstance.fontFile });
          const font = opentype.parse(fontBuffer.buffer);
          const canvas = createCanvas(1400, 200);
          const fontImageBoudingBox = font.getPath(name, 0, 0, 120).getBoundingBox();
          const fontImageVerticalCenter = (fontImageBoudingBox.y1 + fontImageBoudingBox.y2) / 2;
          const context = canvas.getContext('2d');
          font.draw(context, name, 40, 100 - fontImageVerticalCenter, 120);
          const previewImageBuffer = canvas.toBuffer();
          await batchDeleteFromCos({ urls: [fontInstance.previewImage, fontInstance.fontFile] });
          const previewImageKey = `FontLibrary/PreviewImages/${name}/${fontStyleName}.png`;
          const previewImage = await uploadToCos({
            buffer: previewImageBuffer,
            key: previewImageKey,
          });
          const extension = fontInstance.fontFile.split('.').pop();
          const fontFileKey = `FontLibrary/Downloads/${name}/${fontStyleName}.${extension}`;
          const fontFile = await uploadToCos({ buffer: fontBuffer, key: fontFileKey });
          await fontInstance.update({ previewImage, fontFile });
          refreshCdnFile({ urls: [previewImage, fontFile] });
        }
        fontFamilyInstance.update({ name });
      }
      if (language) {
        fontFamilyInstance.update({ language });
      }
      await fontFamilyInstance.reload();
      ctx.body = { success: true, fontFamily: fontFamilyInstance };
    } catch (err) {
      ctx.throw(400, `Update font family error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { id } = ctx.params;
    const { FontLibrary_font, FontLibrary_font_family } = ctx.db;
    try {
      const fontFamilyInstance = await FontLibrary_font_family.findOne({
        where: { id },
        include: [
          {
            model: FontLibrary_font,
            as: 'fonts',
          },
        ],
      });
      if (!fontFamilyInstance) {
        throw new Error('font family not exists');
      }
      if (fontFamilyInstance.fonts.length) {
        const fontFiles = fontFamilyInstance.fonts.map((fontInstance) => fontInstance.fontFile);
        const previewImages = fontFamilyInstance.fonts.map(
          (fontInstance) => fontInstance.previewImage,
        );
        await batchDeleteFromCos({ urls: [...fontFiles, ...previewImages] });
      }
      await fontFamilyInstance.destroy({ cascade: true });
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove font family error: ${err.message}.`);
    }
  },
};
