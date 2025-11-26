module.exports = (params) => {
  const { days, weeks, months } = params;
  const now = new Date();
  let startDate;
  if (days > 0) {
    startDate = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} 00:00:00`);
    startDate = new Date(startDate - (days - 1) * 24 * 3600 * 1000);
  } else if (weeks > 0) {
    const startOfYear = new Date(`${now.getFullYear()}/01/01 00:00:00`);
    const currentWeek = new Date(
      Number(startOfYear)
      + Math.ceil((now - startOfYear) / (7 * 24 * 3600 * 1000)) * (7 * 24 * 3600 * 1000),
    );
    startDate = new Date(currentWeek - weeks * 7 * 24 * 3600 * 1000);
  } else if (months > 0) {
    const getPreviousMonth = (currentMonth) => {
      let year = currentMonth.getFullYear();
      let month = currentMonth.getMonth();
      if (month === 0) {
        year -= 1;
        month = 12;
      }
      return new Date(`${year}/${month}/01 00:00:00`);
    };
    startDate = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/01 00:00:00`);
    for (let i = 1; i < months; i += 1) {
      startDate = getPreviousMonth(startDate);
    }
  } else {
    startDate = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} 00:00:00`);
  }
  return startDate;
};
