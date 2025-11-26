module.exports = (params) => {
  const { days, weeks, months } = params;
  let format;
  let fieldName;
  if (days > 0) {
    format = '%Y/%m/%d';
    fieldName = 'date';
  } else if (weeks > 0) {
    format = '%Y/%u';
    fieldName = 'week';
  } else if (months > 0) {
    format = '%Y/%m';
    fieldName = 'month';
  } else {
    format = '%Y/%m/%d';
    fieldName = 'date';
  }
  return {
    format,
    fieldName,
  };
};
