// const dayjs = require('dayjs');
// // Pour les timezones
// const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
// const timezone = require('dayjs/plugin/timezone');
// const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.extend(isSameOrBefore);
// // On défini les locales
// require('dayjs/locale/fr');
// dayjs.locale('fr');



//     // {
//     //     name: "Paris",
//     //     tz: "Europe/Paris"
//     // }

// // console.log(dayjs('2021-02-06 18:30').tz("Europe/Paris"));

// // const d = new Date(2021, 0, 0);
// // console.log(dayjs(d));
// // console.log(dayjs('2021-02-01T20:30:00.000', "YYYY-MM-DD"));
// // // console.log(dayjs('2021-02-01T16:00:00.000Z'));

// console.log(dayjs().format());
// console.log(dayjs.utc().format());
// console.log(dayjs.utc().toJSON());
// console.log(dayjs.utc().toISOString());

console.log(process.env.NODE_ENV);