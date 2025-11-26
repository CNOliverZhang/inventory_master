const getPagination = require('../../utils/db_query/get_pagination');
const uploadToCos = require('../../utils/file/upload_to_cos');
const getBufferFromCos = require('../../utils/file/get_buffer_from_cos');

module.exports = {
  add: async (ctx) => {
    ctx.verifyParams({
      code: { type: 'string', required: true },
      features: { type: 'string', required: true },
    });
    const { ImageToolkit_version } = ctx.db;
    const { code, features } = ctx.params;
    try {
      if (!ctx.request.files) {
        throw new Error('no files provided');
      }
      const {
        winPackage,
        macPackage,
        winBlockmap,
        macBlockmap,
        winYml,
        macYml,
      } = ctx.request.files;
      if (!winPackage || !winBlockmap || !macPackage || !macBlockmap || !winYml || !macYml) {
        throw new Error('packages or yml files missing');
      }
      const oldWinYmlBuffer = await getBufferFromCos({ key: 'ImageToolkit/Packages/latest.yml' });
      const oldMacYmlBuffer = await getBufferFromCos({ key: 'ImageToolkit/Packages/latest-mac.yml' });
      await uploadToCos({ key: 'ImageToolkit/Packages/latest.yml.bak', buffer: oldWinYmlBuffer });
      await uploadToCos({ key: 'ImageToolkit/Packages/latest-mac.yml.bak', buffer: oldMacYmlBuffer });
      await uploadToCos({ key: 'ImageToolkit/Packages/latest.yml', file: winYml });
      await uploadToCos({ key: 'ImageToolkit/Packages/latest-mac.yml', file: macYml });
      const winBlockmapUrl = await uploadToCos({ file: winBlockmap, key: `ImageToolkit/Packages/${winBlockmap.name}` });
      const macBlockmapUrl = await uploadToCos({ file: macBlockmap, key: `ImageToolkit/Packages/${macBlockmap.name}` });
      const winPackageUrl = await uploadToCos({ file: winPackage, key: `ImageToolkit/Packages/${winPackage.name}` });
      const macPackageUrl = await uploadToCos({ file: macPackage, key: `ImageToolkit/Packages/${macPackage.name}` });
      const data = await ImageToolkit_version.create({
        winBlockmap: winBlockmapUrl,
        winPackage: winPackageUrl,
        macBlockmap: macBlockmapUrl,
        macPackage: macPackageUrl,
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
    const { ImageToolkit_version } = ctx.db;
    try {
      const data = await ImageToolkit_version.findAndCountAll({
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
    const { ImageToolkit_version } = ctx.db;
    try {
      const data = await ImageToolkit_version.findOne({
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
