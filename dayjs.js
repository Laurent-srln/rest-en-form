const dayjs = require('dayjs');
// Pour les timezones
const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
// On défini les locales
require('dayjs/locale/fr');
dayjs.locale('fr');



    // {
    //     name: "Paris",
    //     tz: "Europe/Paris"
    // }

// console.log(dayjs('2021-02-06 18:30').tz("Europe/Paris"));


// console.log(dayjs('2021-03-03 20:30').isBefore(dayjs('2021-03-03 19:30'), 'second'));

// let movingStart = dayjs(`2021-03-03 09:30`);

// console.log(movingStart.add(15, 'minute'));

console.log(dayjs('2021-02-01 18:45').format('mm'));