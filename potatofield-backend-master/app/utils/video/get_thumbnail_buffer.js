const os = require('os');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');

module.exports = ({ path: filePath }) => new Promise((resolve, reject) => {
  const tmpFileName = `video_${Number(new Date())}_screenshot.png`;
  ffmpeg(filePath)
    .on('error', (err) => {
      reject(err);
    })
    .on('end', () => {
      const buffer = fs.readFileSync(path.join(os.tmpdir(), tmpFileName));
      sharp(buffer)
        .resize(360, 360, { fit: 'outside' })
        .webp()
        .toBuffer()
        .then(
          (webpBuffer) => {
            resolve(webpBuffer);
            fs.unlinkSync(path.join(os.tmpdir(), tmpFileName));
          },
          (err) => {
            reject(err);
          },
        );
    })
    .screenshot({
      folder: os.tmpdir(),
      filename: tmpFileName,
      timestamps: ['00:00:00:00'],
    });
});
