// Middleware to normalize file upload structure from multer
// Converts multer's file structure to match the old koa-body format
module.exports = () => async (ctx, next) => {
  if (ctx.request.files && Array.isArray(ctx.request.files)) {
    // Multer stores files as an array, convert to object format
    const filesObj = {};
    ctx.request.files.forEach(file => {
      const fieldName = file.fieldname || 'file';
      filesObj[fieldName] = {
        name: file.originalname,
        path: file.path,
        size: file.size,
        type: file.mimetype,
        fieldname: file.fieldname,
      };
    });
    ctx.request.files = filesObj;
  }
  await next();
};
