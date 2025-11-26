const CryptoJS = require('crypto-js');
const sharp = require('sharp');
const exif = require('exif-reader');
const fs = require('fs');
const Sequelize = require('sequelize');

const getPagination = require('../../utils/db_query/get_pagination');
const uploadToCos = require('../../utils/file/upload_to_cos');
const deleteFromCos = require('../../utils/file/delete_from_cos');
const convertToBuffer = require('../../utils/video/convert_to_buffer');
const getThumbnailBuffer = require('../../utils/video/get_thumbnail_buffer');
const getVideoMetadata = require('../../utils/video/get_metadata');

const FILE_EXTENSION = require('../../constants/file_extension');
const MIME_TYPE = require('../../constants/mime_type');

module.exports = {
  get: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { MediaCenter_file } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { id } = ctx.params;
    try {
      const file = await MediaCenter_file.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!file) {
        throw new Error('file not exists');
      }
      if (file.uploadUserId !== uploadUserId) {
        throw new Error('user not match');
      }
      ctx.body = file;
    } catch (err) {
      ctx.throw(400, `Get media file error: ${err.message}.`);
    }
  },
  list: async (ctx) => {
    ctx.verifyParams({
      tagIdList: { type: 'array', required: false },
      mimeTypes: { type: 'array', required: false },
    });
    const { MediaCenter_file, MediaCenter_tag } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { tagIdList, mimeTypes } = ctx.params;
    try {
      const nestedWhere = {};
      if (tagIdList) {
        nestedWhere.id = {
          [Sequelize.Op.or]: tagIdList.map((tag) => Number(tag)),
        };
      }
      const data = await MediaCenter_file.findAndCountAll({
        ...getPagination(ctx),
        include: [
          {
            model: MediaCenter_tag,
            as: 'tags',
            where: Object.keys(nestedWhere).length ? nestedWhere : undefined,
          },
        ],
        where: {
          uploadUserId,
          ...(mimeTypes
            ? { mimeType: { [Sequelize.Op.or]: mimeTypes } }
            : {}),
        },
        order: [['uploadTime', 'DESC']],
        distinct: true,
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get media file list error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      keepOriginalSize: { type: 'boolean', required: false },
    });
    const { MediaCenter_file } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { name: mediaFileName, keepOriginalSize } = ctx.params;
    const uploadFile = ctx.request.files?.file;
    try {
      if (!uploadFile) {
        throw new Error('no media file');
      }
      const { name, path } = uploadFile;
      const allowedExtensions = [
        ...FILE_EXTENSION.IMAGE,
        ...FILE_EXTENSION.VIDEO,
        ...FILE_EXTENSION.AUDIO,
      ];
      const extension = name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        throw new Error('file type not allowed');
      }
      let mimeType;
      let folderName;
      if (FILE_EXTENSION.IMAGE.includes(extension)) {
        mimeType = MIME_TYPE.IMAGE;
        folderName = 'Images';
      } else if (FILE_EXTENSION.VIDEO.includes(extension)) {
        mimeType = MIME_TYPE.VIDEO;
        folderName = 'Videos';
      } else {
        mimeType = MIME_TYPE.AUDIO;
        folderName = 'Audios';
      }
      const uploadTime = new Date();
      const key = `MediaCenter/${folderName}/${CryptoJS.MD5(`${uploadUserId}_${Number(uploadTime)}`).toString()}`;
      let url;
      let thumbnail = null;
      let metadata = null;
      if (mimeType === MIME_TYPE.IMAGE) {
        if (extension !== 'gif') {
          try {
            const exifBuffer = (await sharp(path).metadata()).exif;
            if (exifBuffer) {
              const exifData = exif(exifBuffer);
              const parsedExifData = {
                manufacturer: exifData.image?.Make,
                model: exifData.image?.Model,
                exposureTime: exifData.exif?.ExposureTime,
                fNumber: exifData.exif?.FNumber,
                iso: exifData.exif?.ISO,
                dateTimeTaken: exifData.exif?.DateTimeOriginal || exifData.exif?.DateTimeDigitized,
                focalLength: exifData.exif?.FocalLength,
                lensManufacturer: exifData.exif?.LensMake,
                lensModel: exifData.exif?.LensModel,
              };
              metadata = JSON.stringify(parsedExifData);
            }
          } catch (err) {
            metadata = null;
          }
          const imageData = sharp(path).withMetadata().rotate();
          if (!keepOriginalSize) {
            imageData.resize(4000, 4000, { fit: 'inside', withoutEnlargement: true });
          }
          const buffer = await imageData.webp({ quality: 75 }).toBuffer();
          url = await uploadToCos({ buffer, key: `${key}.webp` });
          const thumbnailBuffer = await sharp(path)
            .withMetadata()
            .rotate()
            .resize(360, 360, { fit: 'outside' })
            .webp()
            .toBuffer();
          thumbnail = await uploadToCos({ buffer: thumbnailBuffer, key: `${key}.thumbnail.webp` });
        } else {
          const buffer = await fs.readFileSync(path);
          url = await uploadToCos({ buffer, key: `${key}.gif` });
          thumbnail = await url;
        }
      } else if (mimeType === MIME_TYPE.VIDEO) {
        try {
          const rawMetadata = await getVideoMetadata({ path });
          const videoStreamMetadata = rawMetadata.streams?.find((stream) => stream.codec_type === 'video');
          const parsedVideoStreamMetadata = {
            width: videoStreamMetadata.width,
            height: videoStreamMetadata.height,
            duration: videoStreamMetadata.duration,
          };
          metadata = JSON.stringify(parsedVideoStreamMetadata);
        } catch (err) {
          metadata = null;
        }
        const buffer = await convertToBuffer({ path });
        url = await uploadToCos({ buffer, key: `${key}.mp4` });
        const thumbnailBuffer = await getThumbnailBuffer({ path });
        thumbnail = await uploadToCos({ buffer: thumbnailBuffer, key: `${key}.thumbnail.webp` });
      } else {
        url = await uploadToCos({ file: uploadFile, key: `${key}.${extension}` });
      }
      const file = await MediaCenter_file.create({
        name: mediaFileName || null,
        url,
        thumbnail,
        uploadUserId,
        uploadTime,
        mimeType,
        metadata,
      });
      ctx.body = { success: true, file };
    } catch (err) {
      ctx.throw(400, `Add media file error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      name: { type: 'string', required: false },
    });
    const { MediaCenter_file } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { id, name } = ctx.params;
    try {
      const file = await MediaCenter_file.findOne({
        where: { id },
      });
      if (!file) {
        throw new Error('file not exists');
      }
      if (file.uploadUserId !== uploadUserId) {
        throw new Error('user not match');
      }
      await file.update({
        name: name || null,
      });
      await file.reload();
      ctx.body = { success: true, file };
    } catch (err) {
      ctx.throw(400, `Update media file error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { MediaCenter_file } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { id } = ctx.params;
    try {
      const file = await MediaCenter_file.findOne({
        where: { id },
      });
      if (!file) {
        throw new Error('file not exists');
      }
      if (file.uploadUserId !== uploadUserId) {
        throw new Error('user not match');
      }
      await deleteFromCos({ url: file.url });
      if (file.thumbnail) {
        await deleteFromCos({ url: file.thumbnail });
      }
      await file.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove media file error: ${err.message}.`);
    }
  },
  addTag: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      tagId: { type: 'number', required: true },
    });
    const { MediaCenter_file, MediaCenter_tag } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { id, tagId } = ctx.params;
    try {
      const file = await MediaCenter_file.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!file) {
        throw new Error('file not exists');
      }
      if (file.uploadUserId !== uploadUserId) {
        throw new Error('user not match');
      }
      const tag = await MediaCenter_tag.findOne({
        where: { id: tagId },
      });
      if (!tag) {
        throw new Error('tag not exists');
      }
      const hasThisTag = await file.hasTag(tag);
      if (hasThisTag) {
        throw new Error('this file already has this tag');
      }
      await file.addTag(tag);
      await file.reload();
      ctx.body = { success: true, file };
    } catch (err) {
      ctx.throw(400, `Add tag to media file error: ${err.message}.`);
    }
  },
  removeTag: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      tagId: { type: 'number', required: true },
    });
    const { MediaCenter_file, MediaCenter_tag } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { id, tagId } = ctx.params;
    try {
      const file = await MediaCenter_file.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!file) {
        throw new Error('file not exists');
      }
      if (file.uploadUserId !== uploadUserId) {
        throw new Error('user not match');
      }
      const tag = await MediaCenter_tag.findOne({
        where: { id: tagId },
      });
      if (!tag) {
        throw new Error('tag not exists');
      }
      const hasThisTag = await file.hasTag(tag);
      if (!hasThisTag) {
        throw new Error('this file doesn\'t have this tag');
      }
      await file.removeTag(tag);
      await file.reload();
      ctx.body = { success: true, file };
    } catch (err) {
      ctx.throw(400, `Remove tag from media file error: ${err.message}.`);
    }
  },
  clearTags: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { MediaCenter_file } = ctx.db;
    const { id: uploadUserId } = ctx.request.user;
    const { id } = ctx.params;
    try {
      const file = await MediaCenter_file.findOne({
        where: { id },
        include: [{ all: true }],
      });
      if (!file) {
        throw new Error('file not exists');
      }
      if (file.uploadUserId !== uploadUserId) {
        throw new Error('user not match');
      }
      await file.setTags([]);
      await file.reload();
      ctx.body = { success: true, file };
    } catch (err) {
      ctx.throw(400, `Clear tags from media file error: ${err.message}.`);
    }
  },
};
