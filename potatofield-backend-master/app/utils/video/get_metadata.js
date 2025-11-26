const ffmpeg = require('fluent-ffmpeg');

module.exports = ({ path: filePath }) => new Promise((resolve, reject) => {
  ffmpeg(filePath).ffprobe((err, data) => {
    if (err) {
      reject();
    } else {
      resolve(data);
    }
  });
});
