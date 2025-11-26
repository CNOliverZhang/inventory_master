const Sequelize = require('sequelize');
const moment = require('moment');
const uuid = require('uuid');

const getTimeField = require('../../utils/db_query/get_time_field');
const traceBack = require('../../utils/time/trace_back');
const fillEmpty = require('../../utils/time/fill_empty');

module.exports = {
  register: async (ctx) => {
    ctx.verifyParams({
      identifier: { type: 'string', required: true },
      version: { type: 'string', required: true },
      platform: { type: 'string', required: false },
    });
    const { RichTextEditor_client, RichTextEditor_version, RichTextEditor_usage } = ctx.db;
    const { identifier, version, platform } = ctx.params;
    try {
      let client = await RichTextEditor_client.findOne({
        where: { identifier },
      });
      const clientVersion = await RichTextEditor_version.findOne({
        where: { code: version },
      });
      if (!clientVersion) {
        throw new Error('invalid version');
      }
      const now = new Date();
      if (client) {
        client.versionId = clientVersion.id;
        client.save();
      } else {
        if (!uuid.validate(identifier)) {
          throw new Error('invalid identifier');
        }
        client = await RichTextEditor_client.create({
          identifier,
          platform: platform || 'other',
          versionId: clientVersion.id,
          registerTime: now,
        });
      }
      await RichTextEditor_usage.create({
        time: now,
        clientId: client.id,
      });
      ctx.body = {
        success: true,
      };
    } catch (err) {
      ctx.throw(400, `Register error: ${err.message}.`);
    }
  },
  countNew: async (ctx) => {
    ctx.verifyParams({
      days: { type: 'number', required: false },
      weeks: { type: 'number', required: false },
      months: { type: 'number', required: false },
    });
    const { RichTextEditor_client } = ctx.db;
    const { days, weeks, months } = ctx.params;
    const { format, fieldName } = getTimeField({ days, weeks, months });
    const startDate = traceBack({ days, weeks, months });
    const data = (await RichTextEditor_client.findAll({
      where: {
        registerTime: {
          [Sequelize.Op.gte]: startDate,
        },
      },
      attributes: [
        [Sequelize.fn('count', '*'), 'count'],
        [Sequelize.fn('date_format', Sequelize.col('register_time'), format), fieldName],
      ],
      group: fieldName,
    })).map((item) => item.toJSON());
    fillEmpty(data, {
      valueFieldName: 'count',
      days,
      weeks,
      months,
    });
    ctx.body = data;
  },
  countActive: async (ctx) => {
    ctx.verifyParams({
      days: { type: 'number', required: false },
      weeks: { type: 'number', required: false },
      months: { type: 'number', required: false },
    });
    const { days, weeks, months } = ctx.params;
    const { format, fieldName } = getTimeField({ days, weeks, months });
    const startDate = traceBack({ days, weeks, months });
    const data = await ctx.sequelize.query(`
      select count(*) count, a.${fieldName} from
      (
        SELECT client_id, date_format(time, '${format}') ${fieldName}
        from RichTextEditor_usage
        where time >= '${moment(startDate).format('YYYY-MM-DD HH:mm:ss')}'
        group by ${fieldName}, client_id
      ) a
      group by a.${fieldName}
    `, {
      type: Sequelize.QueryTypes.SELECT,
    });
    fillEmpty(data, {
      valueFieldName: 'count',
      days,
      weeks,
      months,
    });
    ctx.body = data;
  },
  count: async (ctx) => {
    const { RichTextEditor_client, RichTextEditor_version } = ctx.db;
    const { count } = (await RichTextEditor_client.findOne({
      attributes: [
        [Sequelize.fn('count', '*'), 'count'],
      ],
    })).toJSON();
    const versionList = (await RichTextEditor_version.findAll()).map((item) => item.toJSON());
    const versionObject = {};
    versionList.forEach((item) => {
      versionObject[item.id] = item.code;
    });
    const versionsRawData = (await RichTextEditor_client.findAll({
      attributes: [
        [Sequelize.fn('count', '*'), 'count'],
        'versionId',
      ],
      group: 'versionId',
    })).map((item) => item.toJSON());
    const versions = versionsRawData.map((item) => {
      const newItem = { ...item };
      newItem.version = versionObject[newItem.versionId];
      delete newItem.versionId;
      return newItem;
    });
    const platforms = await RichTextEditor_client.findAll({
      attributes: [
        [Sequelize.fn('count', '*'), 'count'],
        'platform',
      ],
      group: 'platform',
    });
    ctx.body = {
      total: count,
      versions,
      platforms,
    };
  },
};
