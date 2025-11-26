const Parameter = require('parameter');

module.exports = () => async (ctx, next) => {
  const parameter = new Parameter({ convert: true });
  ctx.verifyParams = (rules) => {
    if (!rules) {
      return;
    }
    const params = ['GET', 'HEAD'].includes(ctx.method.toUpperCase())
      ? { ...ctx.request.query }
      : { ...ctx.request.body };
    Object.entries(params).forEach(([key, value]) => {
      if (rules[key]?.type !== 'boolean' && rules[key]?.type !== 'bool' && rules[key]?.required === false && !value) {
        delete params[key];
        return;
      }
      if ((rules[key]?.type === 'number' || rules[key]?.type === 'int') && !Number.isNaN(Number(value))) {
        params[key] = Number(value);
      } else if ((rules[key]?.type === 'boolean' || rules[key]?.type === 'bool') && (value === 'true' || value === 'false')) {
        params[key] = value === 'true';
      } else if (rules[key]?.type === 'array') {
        if (!Array.isArray(value)) {
          params[key] = [value];
        }
        if (rules[key]?.itemType === 'number' || rules[key]?.itemType === 'int') {
          params[key].forEach((item, index) => {
            if (!Number.isNaN(Number(value))) {
              params[key][index] = Number(value);
            }
          });
        }
        if (rules[key]?.itemType === 'boolean' || rules[key]?.itemType === 'bool') {
          params[key].forEach((item, index) => {
            if (value === 'true' || value === 'false') {
              params[key][index] = value === 'true';
            }
          });
        }
      }
    });
    ctx.params = params;
    const errors = parameter.validate(rules, params);
    if (!errors) {
      return;
    }
    const errorMsg = errors.map((error) => `${error.field} ${error.message}`).join(', ');
    ctx.throw(422, `Validation error: ${errorMsg}.`);
  };
  await next();
};
