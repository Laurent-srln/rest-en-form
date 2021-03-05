const dayjs = require('dayjs');
dayjs().format();
dayjs.extend(utc);
dayjs.extend(timezone);

console.log(dayjs("2021-04-01 11:00:00"));