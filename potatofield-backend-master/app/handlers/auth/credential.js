const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const AUTH_TYPE = require('../../constants/auth_type');

module.exports = {
  list: async (ctx) => {
    const { Auth_credential } = ctx.db;
    const { id: userId } = ctx.request.user;
    try {
      const data = await Auth_credential.findAll({
        where: {
          userId,
        },
        attributes: ['userId', 'identifier', 'authType'],
      });
      ctx.body = data;
    } catch (err) {
      ctx.throw(400, `Get credential list error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      authType: { type: 'number', required: true },
      identifier: { type: 'string', required: true },
      password: { type: 'string', required: false },
      verificationCode: { type: 'string', required: false },
    });
    const { Auth_credential } = ctx.db;
    const {
      authType,
      identifier,
      password,
      verificationCode,
    } = ctx.params;
    const { id: userId } = ctx.request.user;
    try {
      if (![AUTH_TYPE.USERNAME, AUTH_TYPE.PHONE, AUTH_TYPE.EMAIL].includes(authType)) {
        throw new Error('invalid auth type');
      }
      if ([AUTH_TYPE.PHONE, AUTH_TYPE.EMAIL].includes(authType)) {
        if (!verificationCode) {
          throw new Error('verification code required');
        }
        const correctCode = await ctx.redis.get(`${identifier}.code`);
        if (correctCode !== verificationCode) {
          throw new Error('wrong verification code');
        }
        await ctx.redis.del(`${identifier}.code`);
      }
      const homonymicCredential = await Auth_credential.findOne({
        where: {
          identifier,
        },
      });
      if (homonymicCredential) {
        throw new Error('identifier already exists');
      }
      const allCredentials = await Auth_credential.findAndCountAll({
        where: {
          userId,
          authType: {
            [Sequelize.Op.or]: [AUTH_TYPE.USERNAME, AUTH_TYPE.PHONE, AUTH_TYPE.EMAIL],
          },
        },
      });
      if (allCredentials.count) {
        if (password) {
          throw new Error('password already exists');
        } else {
          const specifiedCredential = await Auth_credential.findOne({
            where: {
              userId,
              authType,
            },
          });
          if (specifiedCredential) {
            throw new Error('specified credential already exists');
          } else {
            Auth_credential.create({
              userId,
              authType,
              identifier,
              credential: allCredentials.rows[0].toJSON().credential,
            });
            ctx.body = {
              success: true,
              credential: { identifier, authType },
            };
          }
        }
      } else if (password) {
        const encryptedPassword = await bcrypt.hash(password, 10);
        Auth_credential.create({
          userId,
          authType,
          identifier,
          credential: encryptedPassword,
        });
        ctx.body = {
          success: true,
          credential: { identifier, authType },
        };
      } else {
        throw new Error('password required');
      }
    } catch (err) {
      ctx.throw(400, `Add credential crror: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      authType: { type: 'number', required: true },
    });
    const { Auth_credential } = ctx.db;
    const { authType } = ctx.params;
    const { id: userId } = ctx.request.user;
    try {
      const credential = await Auth_credential.findOne({
        where: {
          userId,
          authType,
        },
      });
      const credentialCount = (await Auth_credential.findAndCountAll({
        where: {
          userId,
        },
      })).count;
      if (!credential) {
        throw new Error('no specified credential');
      } else if (credentialCount < 2) {
        throw new Error('can not remove the only credential');
      } else {
        await credential.destroy();
        ctx.body = { success: true };
      }
    } catch (err) {
      ctx.throw(400, `Remove credential Error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      authType: { type: 'number', required: true },
      identifier: { type: 'string', required: true },
      verificationCode: { type: 'string', required: false },
    });
    const { Auth_credential } = ctx.db;
    const { authType, identifier, verificationCode } = ctx.params;
    const { id: userId } = ctx.request.user;
    try {
      if ([AUTH_TYPE.PHONE, AUTH_TYPE.EMAIL].includes(authType)) {
        if (!verificationCode) {
          throw new Error('verification code required');
        }
        const correctCode = await ctx.redis.get(`${identifier}.code`);
        if (correctCode !== verificationCode) {
          throw new Error('wrong verification code');
        }
        await ctx.redis.del(`${identifier}.code`);
      }
      const credential = await Auth_credential.findOne({
        where: {
          userId,
          authType,
        },
      });
      if (!credential) {
        throw new Error('no specified credential');
      } else {
        await credential.update({ identifier });
        ctx.body = {
          success: true,
          credential: { identifier, authType },
        };
      }
    } catch (err) {
      ctx.throw(400, `Update credential Error: ${err.message}.`);
    }
  },
  changePassword: async (ctx) => {
    ctx.verifyParams({
      credential: { type: 'string', required: true },
    });
    const { Auth_credential } = ctx.db;
    const { credential } = ctx.params;
    const { id: userId } = ctx.request.user;
    const encryptedPassword = await bcrypt.hash(credential, 10);
    await Auth_credential.update({
      credential: encryptedPassword,
    }, {
      where: {
        userId,
        authType: {
          [Sequelize.Op.or]: [AUTH_TYPE.USERNAME, AUTH_TYPE.PHONE, AUTH_TYPE.EMAIL],
        },
      },
    });
    ctx.body = { success: true };
  },
};
