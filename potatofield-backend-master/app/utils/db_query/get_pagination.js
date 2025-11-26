module.exports = (ctx) => {
  if (Object.keys(ctx.params || {}).includes('page') && Object.keys(ctx.params || {}).includes('size')) {
    const { page, size } = ctx.params;
    const options = {
      limit: Number(size),
      offset: (page - 1) * size,
    };
    return options;
  }
  return {};
};
