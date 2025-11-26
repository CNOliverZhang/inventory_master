const os = require('os');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

module.exports = ({ path: filePath }) => new Promise((resolve, reject) => {
  const tmpFileName = path.join(os.tmpdir(), `video_${Number(new Date())}.mp4`);
  ffmpeg(filePath)
    .videoCodec('libx264')
    .on('error', (err) => {
      reject(err);
    })
    .on('end', () => {
      const buffer = fs.readFileSync(tmpFileName);
      resolve(buffer);
      fs.unlinkSync(tmpFileName);
    })
    .save(tmpFileName);
});
