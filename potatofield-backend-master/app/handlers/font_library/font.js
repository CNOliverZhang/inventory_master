const Sequelize = require('sequelize');
const opentype = require('opentype.js');
const { createCanvas } = require('canvas');

const uploadToCos = require('../../utils/file/upload_to_cos');
const batchDeleteFromCos = require('../../utils/file/batch_delete_from_cos');
const getBufferFromCos = require('../../utils/file/get_buffer_from_cos');
const getPagination = require('../../utils/db_query/get_pagination');
const refreshCdnFile = require('../../utils/file/refresh_cdn_file');

const FILE_EXTENSION = require('../../constants/file_extension');

module.exports = {
  list: async (ctx) => {
    ctx.verifyParams({
      language: { type: 'number', required: false },
      fontFamily: { type: 'string', required: false },
    });
    const { language, fontFamily } = ctx.params;
    const { FontLibrary_font, FontLibrary_font_family, FontLibrary_font_style } = ctx.db;
    const where = {};
    if (fontFamily) {
      where['$fontFamily.name$'] = { [Sequelize.Op.like]: `%${fontFamily}%` };
    }
    if (language) {
      where['$fontFamily.language$'] = language;
    }
    const rawData = await FontLibrary_font.findAndCountAll({
      include: [{ all: true }],
      order: [
        [
          {
            model: FontLibrary_font_family,
            as: 'fontFamily',
          },
          'name',
          'ASC',
        ],
        [
          {
            model: FontLibrary_font_style,
            as: 'fontStyle',
          },
          'name',
          'ASC',
        ],
      ],
      where,
      ...getPagination(ctx),
    });
    const data = rawData.rows.map((item) => {
      const newItem = item.toJSON();
      newItem.language = newItem.fontFamily.language;
      newItem.fontFamily = newItem.fontFamily.name;
      newItem.fontStyle = newItem.fontStyle.name;
      return newItem;
    });
    ctx.body = { count: rawData.count, list: data };
  },
  add: async (ctx) => {
    ctx.verifyParams({
      fontFamilyId: { type: 'number', required: true },
      fontStyleId: { type: 'number', required: true },
    });
    const { FontLibrary_font, FontLibrary_font_family, FontLibrary_font_style } = ctx.db;
    const { fontFamilyId, fontStyleId } = ctx.params;
    const requestFontFile = ctx.request.files?.font;
    try {
      const homonymicFont = await FontLibrary_font.findOne({
        where: { fontFamilyId, fontStyleId },
      });
      if (homonymicFont) {
        throw new Error('font already exists');
      }
      if (!requestFontFile) {
        throw new Error('no font file');
      }
      const { name, path } = requestFontFile;
      const allowedExtensions = FILE_EXTENSION.FONT;
      const extension = name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        throw new Error('file type not allowed');
      }
      const fontFamily = await FontLibrary_font_family.findOne({ where: { id: fontFamilyId } });
      if (!fontFamily) {
        throw new Error('font family not exsists');
      }
      const fontStyle = await FontLibrary_font_style.findOne({ where: { id: fontStyleId } });
      if (!fontStyle) {
        throw new Error('font style not exsists');
      }
      const fontFamilyName = fontFamily.name;
      const fontStyleName = fontStyle.name;
      const font = opentype.loadSync(path);
      const canvas = createCanvas(1400, 200);
      const fontImageBoudingBox = font.getPath(fontFamilyName, 0, 0, 120).getBoundingBox();
      const fontImageVerticalCenter = (fontImageBoudingBox.y1 + fontImageBoudingBox.y2) / 2;
      const context = canvas.getContext('2d');
      font.draw(context, fontFamilyName, 40, 100 - fontImageVerticalCenter, 120);
      const previewImageBuffer = canvas.toBuffer();
      const previewImageKey = `FontLibrary/PreviewImages/${fontFamilyName}/${fontStyleName}.png`;
      const previewImage = await uploadToCos({ buffer: previewImageBuffer, key: previewImageKey });
      const fontFileKey = `FontLibrary/Downloads/${fontFamilyName}/${fontStyleName}.${extension}`;
      const fontFile = await uploadToCos({ file: requestFontFile, key: fontFileKey });
      const fontInstance = await FontLibrary_font.create({
        fontFamilyId,
        fontStyleId,
        fontFile,
        previewImage,
      });
      ctx.body = { success: true, font: fontInstance };
    } catch (err) {
      ctx.throw(400, `Add font error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      fontStyleId: { type: 'number', required: false },
    });
    const { FontLibrary_font, FontLibrary_font_style } = ctx.db;
    const { id, fontStyleId } = ctx.params;
    const requestFontFile = ctx.request.files?.font;
    try {
      if (requestFontFile) {
        const allowedExtensions = FILE_EXTENSION.FONT;
        const extension = requestFontFile.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
          throw new Error('file type not allowed');
        }
      }
      const fontInstance = await FontLibrary_font.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!fontInstance) {
        throw new Error('font not exists');
      }
      const originalFontStyleId = fontInstance.fontStyle.id;
      if (fontStyleId && fontStyleId !== originalFontStyleId) {
        const homonymicFont = await FontLibrary_font.findOne({
          where: {
            fontFamilyId: fontInstance.fontFamily.id,
            fontStyleId,
          },
        });
        if (homonymicFont) {
          throw new Error('font style collision');
        }
        const fontStyle = await FontLibrary_font_style.findOne({ where: { id: fontStyleId } });
        if (!fontStyle) {
          throw new Error('font style not exsists');
        }
        await fontInstance.update({ fontStyleId });
        await fontInstance.reload();
        if (!requestFontFile) {
          const fontFamilyName = fontInstance.fontFamily.name;
          const fontStyleName = fontStyle.name;
          const fontBuffer = await getBufferFromCos({ url: fontInstance.fontFile });
          const font = opentype.parse(fontBuffer.buffer);
          const canvas = createCanvas(1400, 200);
          const fontImageBoudingBox = font.getPath(fontFamilyName, 0, 0, 120).getBoundingBox();
          const fontImageVerticalCenter = (fontImageBoudingBox.y1 + fontImageBoudingBox.y2) / 2;
          const context = canvas.getContext('2d');
          font.draw(context, fontFamilyName, 40, 100 - fontImageVerticalCenter, 120);
          const previewImageBuffer = canvas.toBuffer();
          await batchDeleteFromCos({ urls: [fontInstance.previewImage, fontInstance.fontFile] });
          const previewImageKey = `FontLibrary/PreviewImages/${fontFamilyName}/${fontStyleName}.png`;
          const previewImage = await uploadToCos({
            buffer: previewImageBuffer,
            key: previewImageKey,
          });
          const extension = fontInstance.fontFile.split('.').pop();
          const fontFileKey = `FontLibrary/Downloads/${fontFamilyName}/${fontStyleName}.${extension}`;
          const fontFile = await uploadToCos({ buffer: fontBuffer, key: fontFileKey });
          refreshCdnFile({ urls: [previewImage, fontFile] });
          await fontInstance.update({ previewImage, fontFile });
          await fontInstance.reload();
        }
      }
      if (requestFontFile) {
        const { name, path } = requestFontFile;
        const extension = name.split('.').pop().toLowerCase();
        const fontFamilyName = fontInstance.fontFamily.name;
        const fontStyleName = fontInstance.fontStyle.name;
        const font = opentype.loadSync(path);
        const canvas = createCanvas(1400, 200);
        const fontImageBoudingBox = font.getPath(fontFamilyName, 0, 0, 120).getBoundingBox();
        const fontImageVerticalCenter = (fontImageBoudingBox.y1 + fontImageBoudingBox.y2) / 2;
        const context = canvas.getContext('2d');
        font.draw(context, fontFamilyName, 40, 100 - fontImageVerticalCenter, 120);
        const previewImageBuffer = canvas.toBuffer();
        await batchDeleteFromCos({ urls: [fontInstance.previewImage, fontInstance.fontFile] });
        const previewImageKey = `FontLibrary/PreviewImages/${fontFamilyName}/${fontStyleName}.png`;
        const previewImage = await uploadToCos({
          buffer: previewImageBuffer,
          key: previewImageKey,
        });
        const fontFileKey = `FontLibrary/Downloads/${fontFamilyName}/${fontStyleName}.${extension}`;
        const fontFile = await uploadToCos({ file: requestFontFile, key: fontFileKey });
        refreshCdnFile({ urls: [previewImage, fontFile] });
        await fontInstance.update({ previewImage, fontFile });
        await fontInstance.reload();
      }
      ctx.body = { success: true, font: fontInstance };
    } catch (err) {
      ctx.throw(400, `Update font error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { FontLibrary_font } = ctx.db;
    const { id } = ctx.params;
    try {
      const fontInstance = await FontLibrary_font.findOne({ where: { id } });
      if (!fontInstance) {
        throw new Error('font not exsists');
      }
      await batchDeleteFromCos({ urls: [fontInstance.previewImage, fontInstance.fontFile] });
      await fontInstance.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove font error: ${err.message}`);
    }
  },
  random: async (ctx) => {
    const { FontLibrary_font } = ctx.db;
    const data = (await FontLibrary_font.findOne({
      include: [{ all: true }],
      order: Sequelize.literal('rand()'),
    })).toJSON();
    data.language = data.fontFamily.language;
    data.fontFamily = data.fontFamily.name;
    data.fontStyle = data.fontStyle.name;
    ctx.body = data;
  },
};
