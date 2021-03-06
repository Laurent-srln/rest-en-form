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

const Coaching = require('../models/coaching');

const db = require('../database');
const { time } = require('console');

const coachingMapper = {

    findAllBookings: async (coachId) => {
        const result = await db.query(`
        SELECT to_char(start_time, 'YYYY-MM-DD') as date, start_time::time, end_time::time, concat(member.firstname,' ', member.lastname)
        FROM "coaching" c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        LEFT join "user" member ON c.member_id = member.id
        WHERE c.member_id IS NOT NULL
        AND c.coach_id=$1
        ORDER BY start_time;`,
        [coachId])

        if(!result.rows){
            throw new Error("Pas de RDV pour ce coach"+coachId)
        }

        return result.rows;
    },

    findNextBookings: async (coachId) => {
        const result = await db.query(`
        SELECT to_char(start_time, 'YYYY-MM-DD') as date, start_time::time, end_time::time, concat(member.firstname,' ', member.lastname)
        FROM "coaching" c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        LEFT join "user" member ON c.member_id = member.id
        WHERE c.member_id IS NOT NULL
        AND c.end_time > now()
        AND c.coach_id=$1
        ORDER BY start_time;`,
        [coachId])

        if(!result.rows){
            throw new Error("Pas de RDV pour ce coach"+coachId)
        }

        return result.rows;
    },

    findLastBookings: async (coachId) => {
        const result = await db.query(`
        SELECT to_char(start_time, 'YYYY-MM-DD') as date, start_time::time, end_time::time, concat(member.firstname,' ', member.lastname)
        FROM "coaching" c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        LEFT join "user" member ON c.member_id = member.id
        WHERE c.member_id IS NOT NULL
        AND c.end_time < now()
        AND c.coach_id=$1
        ORDER BY start_time;`,
        [coachId])

        if(!result.rows){
            throw new Error("Pas de RDV pour ce coach"+coachId)
        }

        return result.rows;
    },

    addCoachings: async (params) => {

        const { date, start, end, coach_id} = params;

        let movingStart = dayjs(date + start);
        let lastEnd = dayjs(date + end);

        let coachings = []

       
            do {
            const result = await db.query(`
            INSERT INTO coaching (start_time, end_time, coach_id)
            VALUES ($1, $2, $3) RETURNING * ;`, 
            [ movingStart, movingStart.add(15, 'minute'), coach_id
            ]
);
            movingStart = movingStart.add(15, 'minute');
            coachings.push(result.rows[0])

        }  while(movingStart.isBefore(lastEnd, 'second')) 
        ;

        return coachings;


        console.log(firstStart);

    }



    
    
};

module.exports = coachingMapper;