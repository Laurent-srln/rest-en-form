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

    findNextBookingsByMember: async (memberId) => {

        const result = await db.query(`
        SELECT c.id, start_time, end_time, coach_id, coach.firstname as coach_firstname, coach.lastname as coach_lastname, member_id, member.firstname as member_firstname, member.lastname as member_lastname, c.created_at, c.updated_at
        FROM "coaching" c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        LEFT join "user" member ON c.member_id = member.id
        WHERE c.member_id = $1
        AND c.end_time > now()
        ORDER BY start_time;`,
        [memberId])

        return result.rows.map(coaching => new Coaching(coaching));
    },

    findNextBookings: async (coachId) => {
        const result = await db.query(`
        SELECT c.id, start_time, end_time, coach_id, coach.firstname as coach_firstname, coach.lastname as coach_lastname, member_id, member.firstname as member_firstname, member.lastname as member_lastname, c.created_at, c.updated_at
        FROM "coaching" c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        LEFT join "user" member ON c.member_id = member.id
        WHERE c.member_id IS NOT NULL
        AND c.end_time > now()
        AND c.coach_id=$1
        ORDER BY start_time;`,
        [coachId])

        return result.rows.map(coaching => new Coaching(coaching));
    },

    findLastBookings: async (coachId) => {
        const result = await db.query(`
        SELECT c.id, start_time, end_time, coach_id, coach.firstname as coach_firstname, coach.lastname as coach_lastname, member_id, member.firstname as member_firstname, member.lastname as member_lastname, c.created_at, c.updated_at
        FROM "coaching" c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        LEFT join "user" member ON c.member_id = member.id
        WHERE c.member_id IS NOT NULL
        AND c.end_time < now()
        AND c.coach_id=$1
        ORDER BY start_time;`,
        [coachId])

        return result.rows.map(coaching => new Coaching(coaching));
    },

    addCoachings: async (params) => {
        console.log(params);

        const { date, start, end, coachId} = params;
        const startTs = dayjs(params.date + params.start);
        const endTs = dayjs(params.date + params.end);

        console.log(coachId);

        const checkCoach = await db.query(`
        SELECT id FROM "user" 
        WHERE id = $1
        AND role = 'COACH';`, [coachId]);

        if (!checkCoach.rows.length) {

            console.log(checkCoach.rows[0]);
            throw new Error(`Il n'y a pas de coach avec le user_id : ${coachId}`)
        };

        const checkCoachings = await db.query(`
        SELECT * FROM "coaching" 
        WHERE coach_id = $1
        AND (start_time >= $2 AND start_time < $3);`, [coachId, startTs, endTs]);

        console.log(checkCoachings.rows.length);
        console.log(startTs);
        console.log(endTs);

        if (checkCoachings.rows.length) {

            throw new Error(`Il y a déjà des créneaux coaching existant pour ce coach dans cet interval de temps.`)
        };
        


        let movingStart = dayjs(date + start);
        let lastEnd = dayjs(date + end);

        let coachings = []

       
            do {
            const result = await db.query(`
            INSERT INTO coaching (start_time, end_time, coach_id)
            VALUES ($1, $2, $3) RETURNING * ;`, 
            [ movingStart, movingStart.add(15, 'minute'), coachId
            ]
);
            movingStart = movingStart.add(15, 'minute');
            coachings.push(result.rows[0])

        }  while(movingStart.isBefore(lastEnd, 'second')) 
        ;

        return coachings;


        console.log(firstStart);

    },

    findAvailableCoachings: async (date) => {

        const availableCoachings = await db.query(`
        SELECT c.id, u.firstname, u.lastname, c.start_time::time, c.end_time::time 
        FROM "coaching" c
        LEFT JOIN "user" u ON c.coach_id = u.id
        WHERE start_time::date = $1
        AND member_id IS NULL;`, [date]);
    

    return availableCoachings.rows;


    },

    findOneCoaching : async (id) => {

        const result = await db.query(`
        SELECT *
        FROM "coaching"
        WHERE id = $1`, [id])

        if(!result.rows[0]){
           
            throw new Error( `Pas de coaching avec cet id`);
        }
        
        return result.rows[0];
    },

    deleteOneCoaching : async (id) => {

        const deletedCoaching = await db.query(`
        DELETE FROM "coaching"
        WHERE coaching.id = $1
        `, [id])

        return deletedCoaching;
    },



    bookCoaching: async (memberId, coachingId ) => {


        const result = await db.query(`
        UPDATE "coaching"
            SET member_id = $1
            WHERE id = $2`, [memberId, coachingId]
        )

        
        return result.rows[0];
    },

    deleteBooking : async (memberId, coachingId) => {
        const result = await db.query(`
        UPDATE "coaching"
            SET member_id = NULL
            WHERE member_id = $1 AND id = $2`, [memberId, coachingId]
        )

        
        return result.rows[0]; 
    }

};

module.exports = coachingMapper;