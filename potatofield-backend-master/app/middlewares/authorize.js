const jwt = require('jsonwebtoken');

module.exports = (jwtSecret) => (options = {}) => {
  const { required, adminOnly } = options;
  return async (ctx, next) => {
    const { Auth_user, User_profile } = ctx.db;
    const token = ctx.header.authorization?.split(' ')?.[1];
    try {
      const { userId } = jwt.verify(token, jwtSecret);
      const user = await Auth_user.findOne({
        where: {
          id: userId,
        },
        include: {
          model: User_profile,
          attributes: ['nickname', 'avatar', 'intro'],
          as: 'profile',
        },
      });
      if (user) {
        if (adminOnly && !user.isAdmin) {
          throw new Error('only for admin');
        } else {
          ctx.request.user = user;
          return next();
        }
      } else {
        throw new Error('invalid user');
      }
    } catch (err) {
      if (!required && !adminOnly) {
        return next();
      }
      ctx.throw(401, `Authentication error: ${err.message}.`);
    }
  };
};
