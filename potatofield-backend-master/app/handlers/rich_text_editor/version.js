const getPagination = require('../../utils/db_query/get_pagination');
const uploadToCos = require('../../utils/file/upload_to_cos');
const getBufferFromCos = require('../../utils/file/get_buffer_from_cos');

module.exports = {
  add: async (ctx) => {
    ctx.verifyParams({
      code: { type: 'string', required: true },
      features: { type: 'string', required: true },
    });
    const { RichTextEditor_version } = ctx.db;
    const { code, features } = ctx.params;
    try {
      if (!ctx.request.files) {
        throw new Error('no files provided');
      }
      const {
        macYml,
        macPackage,
        macZip,
        macZipBlockmap,
        macBlockmap,
        winYml,
        winPackage,
        winBlockmap,
      } = ctx.request.files;
      if (
        !winPackage
        || !winBlockmap
        || !winYml
        || !macPackage
        || !macBlockmap
        || !macZip
        || !macZipBlockmap
        || !macYml
      ) {
        throw new Error('packages or yml files missing');
      }
      const last = await RichTextEditor_version.findOne({
        order: [
          ['pubDate', 'DESC'],
        ],
      });
      if (last) {
        const oldWinYmlBuffer = await getBufferFromCos({ key: 'RichTextEditor/Packages/latest.yml' });
        const oldMacYmlBuffer = await getBufferFromCos({ key: 'RichTextEditor/Packages/latest-mac.yml' });
        await uploadToCos({ key: `RichTextEditor/Packages/latest-${last.code}.yml`, buffer: oldWinYmlBuffer });
        await uploadToCos({ key: `RichTextEditor/Packages/latest-mac-${last.code}.yml`, buffer: oldMacYmlBuffer });
      }
      await uploadToCos({ key: 'RichTextEditor/Packages/latest.yml', file: winYml });
      await uploadToCos({ key: 'RichTextEditor/Packages/latest-mac.yml', file: macYml });
      const winBlockmapUrl = await uploadToCos({ file: winBlockmap, key: `RichTextEditor/Packages/${winBlockmap.name}` });
      const macBlockmapUrl = await uploadToCos({ file: macBlockmap, key: `RichTextEditor/Packages/${macBlockmap.name}` });
      const winPackageUrl = await uploadToCos({ file: winPackage, key: `RichTextEditor/Packages/${winPackage.name}` });
      const macPackageUrl = await uploadToCos({ file: macPackage, key: `RichTextEditor/Packages/${macPackage.name}` });
      const macZipUrl = await uploadToCos({ file: macZip, key: `RichTextEditor/Packages/${macZip.name}` });
      const macZipBlockmapUrl = await uploadToCos({ file: macZip, key: `RichTextEditor/Packages/${macZipBlockmap.name}` });
      const data = await RichTextEditor_version.create({
        winBlockmap: winBlockmapUrl,
        winPackage: winPackageUrl,
        macBlockmap: macBlockmapUrl,
        macPackage: macPackageUrl,
        macZip: macZipUrl,
        macZipBlockmap: macZipBlockmapUrl,
        features,
        code,
        pubDate: new Date(),
      });
      ctx.body = { success: true, version: data };
    } catch (err) {
      ctx.throw(400, `Add version error: ${err.message}`);
    }
  },
  list: async (ctx) => {
    const { RichTextEditor_version } = ctx.db;
    try {
      const data = await RichTextEditor_version.findAndCountAll({
        order: [
          ['pubDate', 'DESC'],
        ],
        ...getPagination(ctx),
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get version list error: ${err.message}.`);
    }
  },
  latest: async (ctx) => {
    const { RichTextEditor_version } = ctx.db;
    try {
      const data = await RichTextEditor_version.findOne({
        order: [
          ['pubDate', 'DESC'],
        ],
      });
      ctx.body = data;
    } catch (err) {
      ctx.throw(400, `Get latest version error: ${err.message}.`);
    }
  },
};
