/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:11:18
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 20:13:32
 * @FilePath: /potatofield-backend/app/handlers/image_notebook/version.js
 * @Description: 
 */
const getPagination = require('../../utils/db_query/get_pagination');
const uploadToCos = require('../../utils/file/upload_to_cos');
const getBufferFromCos = require('../../utils/file/get_buffer_from_cos');

module.exports = {
  add: async (ctx) => {
    ctx.verifyParams({
      code: { type: 'string', required: true },
      features: { type: 'string', required: true },
    });
    const { ImageNotebook_version } = ctx.db;
    const { code, features } = ctx.params;
    try {
      if (!ctx.request.files) {
        throw new Error('no files provided');
      }
      const {
        macYml,
        macPackage,
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
        || !macYml
      ) {
        throw new Error('packages or yml files missing');
      }
      const last = await ImageNotebook_version.findOne({
        order: [
          ['pubDate', 'DESC'],
        ],
      });
      if (last) {
        const oldWinYmlBuffer = await getBufferFromCos({ key: 'ImageNotebook/Packages/latest.yml' });
        const oldMacYmlBuffer = await getBufferFromCos({ key: 'ImageNotebook/Packages/latest-mac.yml' });
        await uploadToCos({ key: `ImageNotebook/Packages/latest-${last.code}.yml`, buffer: oldWinYmlBuffer });
        await uploadToCos({ key: `ImageNotebook/Packages/latest-mac-${last.code}.yml`, buffer: oldMacYmlBuffer });
      }
      await uploadToCos({ key: 'ImageNotebook/Packages/latest.yml', file: winYml });
      await uploadToCos({ key: 'ImageNotebook/Packages/latest-mac.yml', file: macYml });
      const winBlockmapUrl = await uploadToCos({ file: winBlockmap, key: `ImageNotebook/Packages/${winBlockmap.name}` });
      const macBlockmapUrl = await uploadToCos({ file: macBlockmap, key: `ImageNotebook/Packages/${macBlockmap.name}` });
      const winPackageUrl = await uploadToCos({ file: winPackage, key: `ImageNotebook/Packages/${winPackage.name}` });
      const macPackageUrl = await uploadToCos({ file: macPackage, key: `ImageNotebook/Packages/${macPackage.name}` });
      const data = await ImageNotebook_version.create({
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
    const { ImageNotebook_version } = ctx.db;
    try {
      const data = await ImageNotebook_version.findAndCountAll({
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
    const { ImageNotebook_version } = ctx.db;
    try {
      const data = await ImageNotebook_version.findOne({
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
