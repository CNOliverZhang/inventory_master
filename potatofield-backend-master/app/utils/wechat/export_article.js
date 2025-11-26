const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs').promises;
const fsSync = require('fs');
const os = require('os');
const path = require('path');
const juice = require('juice');
const opentype = require('opentype.js');
const { createCanvas, Image } = require('canvas');
const FormData = require('form-data');

const api = require('../../apis');
const cssString = require('../../constants/blog_article_css_string');
const { websiteUrl, cosUrl } = require('../../apis/baseUrl');

module.exports = ({ article, content, accessToken }) => new Promise((resolve, reject) => {
  (async () => {
    try {
      const { coverImage } = article;
      let coverImageBuffer;
      if (!coverImage) {
        const COVER_IMAGE_HEIGHT = 766;
        const COVER_IMAGE_WIDTH = 1800;
        const COVER_IMAGE_TEXT_START_X = 1300;
        const COVER_IMAGE_TEXT_LINE_HEIGHT = 100;
        const COVER_IMAGE_TEXT_FONT_SIZE = 60;
        const COVER_IMAGE_TEXT_MAX_WIDTH = 420;
        const canvas = createCanvas(COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT);
        const context = canvas.getContext('2d');
        const bgImageBuffer = (await axios.get(`${cosUrl}/Static/WechatShare.png`, { responseType: 'arraybuffer', headers: { referer: 'api.potatofield.cn' } })).data;
        const img = new Image();
        img.onload = () => context.drawImage(img, 0, 0, COVER_IMAGE_WIDTH, COVER_IMAGE_HEIGHT);
        img.onerror = () => reject();
        img.src = bgImageBuffer;
        const fontBuffer = (await axios.get(`${cosUrl}/FontLibrary/Downloads/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93/%E6%9E%81%E7%BB%86.otf`, { responseType: 'arraybuffer', headers: { referer: 'api.potatofield.cn' } })).data;
        const font = opentype.parse(fontBuffer.buffer);
        const charactors = article.title.split('');
        const lines = [];
        let wordArr = [];
        let currentLine = '';
        for (const charactor of charactors) {
          if (!/^[\u4E00-\u9FFF ]$/.test(charactor)) {
            wordArr.push(charactor);
          } else {
            if (wordArr.length) {
              const word = wordArr.join('');
              wordArr = [];
              const newLineWidth = font.getPath(
                currentLine + word,
                0,
                0,
                COVER_IMAGE_TEXT_FONT_SIZE,
              ).getBoundingBox().x2;
              if (newLineWidth > COVER_IMAGE_TEXT_MAX_WIDTH) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine += word;
              }
            }
            if (charactor === ' ') {
              const newLineWidth = font.getPath(
                currentLine + charactor,
                0,
                0,
                COVER_IMAGE_TEXT_FONT_SIZE,
              ).getBoundingBox().x2;
              if (newLineWidth > COVER_IMAGE_TEXT_MAX_WIDTH) {
                lines.push(currentLine);
                currentLine = '';
              } else {
                currentLine += charactor;
              }
            } else {
              const newLineWidth = font.getPath(
                currentLine + charactor,
                0,
                0,
                COVER_IMAGE_TEXT_FONT_SIZE,
              ).getBoundingBox().x2;
              if (newLineWidth > COVER_IMAGE_TEXT_MAX_WIDTH) {
                lines.push(currentLine);
                currentLine = charactor;
              } else {
                currentLine += charactor;
              }
            }
          }
        }
        lines.push(currentLine);
        lines.forEach((line, index) => {
          font.draw(
            context,
            line,
            COVER_IMAGE_TEXT_START_X,
            COVER_IMAGE_HEIGHT / 2
          - COVER_IMAGE_TEXT_LINE_HEIGHT * (lines.length / 2)
          + COVER_IMAGE_TEXT_LINE_HEIGHT * index
          + COVER_IMAGE_TEXT_FONT_SIZE,
            COVER_IMAGE_TEXT_FONT_SIZE,
          );
        });
        coverImageBuffer = canvas.toBuffer();
      } else {
        coverImageBuffer = (await axios.get(coverImage, { responseType: 'arraybuffer', headers: { referer: 'api.potatofield.cn' } })).data;
      }
      const coverImagePath = path.join(os.tmpdir(), `cover_image_${Number(new Date())}.png`);
      await sharp(coverImageBuffer).png().toFile(coverImagePath);
      const formData = new FormData();
      formData.append('media', fsSync.createReadStream(coverImagePath));
      const coverImageRes = await axios.post(
        `${api.wechat.uploadMedia}?access_token=${accessToken}&type=image`,
        formData,
        { headers: formData.getHeaders() },
      );
      const coverImageId = coverImageRes.data.media_id;
      await fs.unlink(coverImagePath);
      let parsedContent = content;
      const images = parsedContent.match(/<img.*?(?:>|\/>)/gi);
      if (images) {
        for (const image of images) {
          const src = image.match(/src=['"]?([^'"]*)['"]?/i);
          const url = src?.[1];
          if (url) {
            const imageBuffer = (await axios.get(url, { responseType: 'arraybuffer', headers: { referer: 'api.potatofield.cn' } })).data;
            let tempFilePath = '';
            if (url.endsWith('gif')) {
              tempFilePath = path.join(os.tmpdir(), `image_${Number(new Date())}.gif`);
              await fs.writeFile(tempFilePath, imageBuffer);
            } else {
              tempFilePath = path.join(os.tmpdir(), `image_${Number(new Date())}.png`);
              await sharp(imageBuffer).resize(2000, 2000, { fit: 'inside', withoutEnlargement: true }).png({ quality: 90 }).toFile(tempFilePath);
            }
            const imageFormData = new FormData();
            imageFormData.append('media', fsSync.createReadStream(tempFilePath));
            const res = await axios.post(
              `${api.wechat.uploadImage}?access_token=${accessToken}`,
              imageFormData,
              { headers: imageFormData.getHeaders() },
            );
            parsedContent = parsedContent.replace(url, res.data.url);
            await fs.unlink(tempFilePath);
          }
        }
      }
      parsedContent = juice.inlineContent(parsedContent, cssString);
      const res = await axios.post(`${api.wechat.addArticle}?access_token=${accessToken}`, {
        articles: [{
          title: article.title,
          thumb_media_id: coverImageId,
          author: article.author.profile?.nickname,
          digest: article.introduction?.slice(0, 120),
          content: parsedContent,
          content_source_url: `${websiteUrl}/blog/article/detail?id=${article.id}`,
          need_open_comment: 1,
          show_cover_pic: 0,
        }],
      });
      if (res.status === 200 && res.data?.media_id) {
        resolve();
      } else {
        reject(new Error('Failed to add article to WeChat'));
      }
    } catch (err) {
      reject(err);
    }
  })();
});
