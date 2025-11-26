const moment = require('moment');

const getTimeField = require('../db_query/get_time_field');
const traceBack = require('./trace_back');

module.exports = (data, params) => {
  const {
    valueFieldName,
    days,
    weeks,
    months,
  } = params;
  const { fieldName } = getTimeField({ days, weeks, months });
  const startDate = traceBack({ days, weeks, months });
  const allItems = [];
  let formatStr = 'YYYY/MM/DD';
  if (weeks) {
    formatStr = 'YYYY/WW';
  } else if (months) {
    formatStr = 'YYYY/MM';
  }
  let date = startDate;
  while (date < new Date()) {
    allItems.push(moment(date).format(formatStr));
    if (days) {
      date = new Date(1000 * 3600 * 24 + Number(date));
    } else if (weeks) {
      date = new Date(1000 * 3600 * 24 * 7 + Number(date));
    } else if (months) {
      date = new Date(`${date.getFullYear()}/${date.getMonth() + 2}/01 00:00:00`);
    } else {
      date = new Date(1000 * 3600 * 24 + Number(date));
    }
  }
  const nonZeroItems = data.map((item) => item[fieldName]);
  allItems.forEach((item) => {
    if (!nonZeroItems.includes(item)) {
      data.push({ [fieldName]: item, [valueFieldName]: 0 });
    }
  });
  data.sort((a, b) => {
    const arrayA = a[fieldName].split('/');
    const arrayB = b[fieldName].split('/');
    return arrayA[0] - arrayB[0] || arrayA[1] - arrayB[1] || arrayA[2] - arrayB[2];
  });
};
