module.exports = {
  getFontList: async (ctx) => {
    const { FontLibrary_font, FontLibrary_font_family, FontLibrary_font_style } = ctx.db;
    const rawData = await FontLibrary_font.findAll({
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
    });
    const data = rawData.map((item) => {
      const newItem = item.toJSON();
      newItem.language = newItem.fontFamily.language === 1 ? '英文' : '中文';
      newItem.verbose = newItem.fontFamily.name;
      newItem.style = newItem.fontStyle.name;
      newItem.src = newItem.fontFile;
      newItem.image = newItem.previewImage;
      const filename = newItem.fontFile.split('/').pop();
      newItem.font_family = filename.split('.')[0].split('-').join('');
      delete newItem.fontStyleId;
      delete newItem.fontFamilyId;
      delete newItem.font_style_id;
      delete newItem.font_family_id;
      delete newItem.fontStyle;
      delete newItem.fontFamily;
      delete newItem.fontFile;
      delete newItem.previewImage;
      return newItem;
    });
    ctx.body = data;
  },
  getVersionList: async (ctx) => {
    const { ImageToolkit_version } = ctx.db;
    const rawData = await ImageToolkit_version.findAll({
      order: [
        ['pub_date', 'DESC'],
      ],
    });
    const data = rawData.map((item) => {
      const newItem = item.toJSON();
      newItem.pub_date = newItem.pubDate;
      newItem.mac_package = newItem.macPackage;
      newItem.mac_blockmap = newItem.macBlockmap;
      newItem.win_package = newItem.winPackage;
      newItem.win_blockmap = newItem.winBlockmap;
      delete newItem.pubDate;
      delete newItem.macPackage;
      delete newItem.macBlockmap;
      delete newItem.winPackage;
      delete newItem.winBlockmap;
      return newItem;
    });
    ctx.body = data;
  },
  getMessageList: async (ctx) => {
    const { ImageToolkit_message } = ctx.db;
    const rawData = await ImageToolkit_message.findAll({
      order: [
        ['pub_date', 'DESC'],
      ],
    });
    const data = rawData.map((item) => {
      const newItem = item.toJSON();
      newItem.pub_date = newItem.pubDate;
      delete newItem.pubDate;
      return newItem;
    });
    ctx.body = data;
  },
};
