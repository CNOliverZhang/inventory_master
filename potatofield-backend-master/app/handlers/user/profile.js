const CryptoJS = require('crypto-js');
const sharp = require('sharp');

const uploadToCos = require('../../utils/file/upload_to_cos');
const deleteFromCos = require('../../utils/file/delete_from_cos');

const FILE_EXTENSION = require('../../constants/file_extension');

module.exports = {
  get: async (ctx) => {
    ctx.verifyParams({
      userId: { type: 'number', required: false },
    });
    const { User_profile } = ctx.db;
    const userId = ctx.params?.userId || ctx.request.user?.id;
    try {
      if (!userId) {
        throw new Error('no user id');
      }
      const profile = await User_profile.findOne({
        where: { userId },
      });
      if (!profile) {
        throw new Error('invalid user');
      }
      ctx.body = profile;
    } catch (err) {
      ctx.throw(400, `Get profile error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      nickname: { type: 'string', required: false },
      intro: { type: 'string', required: false },
    });
    const { User_profile } = ctx.db;
    const { nickname, intro } = ctx.params;
    const { id: userId } = ctx.request.user;
    const profile = await User_profile.findOne({
      where: {
        userId,
      },
    });
    await profile.update({
      nickname: nickname === undefined ? null : nickname,
      intro: intro === undefined ? null : intro,
    }, {
      where: { userId },
    });
    await profile.reload();
    ctx.body = { success: true, profile };
  },
  deleteAvatar: async (ctx) => {
    const { User_profile } = ctx.db;
    const { id: userId } = ctx.request.user;
    const profile = await User_profile.findOne({
      where: { userId },
    });
    const { avatar } = profile;
    await deleteFromCos({ url: avatar });
    await profile.update({ avatar: null });
    ctx.body = { success: true };
  },
  uploadAvatar: async (ctx) => {
    const { User_profile } = ctx.db;
    const { id: userId } = ctx.request.user;
    const avatarFile = ctx.request.files?.avatar;
    try {
      if (!avatarFile) {
        throw new Error('no avatar file');
      }
      const { name, path } = avatarFile;
      const allowedExtensions = FILE_EXTENSION.IMAGE;
      const extension = name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        throw new Error('file type not allowed');
      }
      const profile = await User_profile.findOne({ where: { userId } });
      if (profile.avatar) {
        await deleteFromCos({ url: profile.avatar });
      }
      const key = `User/Avatars/user_${CryptoJS.MD5(String(userId))}_${Number(new Date())}.webp`;
      const avatarBuffer = await sharp(path).resize({
        width: 640,
        height: 640,
      }).webp().toBuffer();
      const avatar = await uploadToCos({ buffer: avatarBuffer, key });
      await profile.update({
        avatar,
      });
      ctx.body = { success: true, avatar };
    } catch (err) {
      ctx.throw(400, `Upload avatar error: ${err.message}.`);
    }
  },
};
