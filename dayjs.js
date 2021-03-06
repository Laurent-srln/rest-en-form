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

console.log(dayjs('2021-02-06').tz("Europe/Paris").format('YYYY-MM-DD'));


console.log(dayjs('2021-03-03').isSameOrBefore(dayjs(), 'day'));