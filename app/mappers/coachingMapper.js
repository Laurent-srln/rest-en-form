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

    
    
};

module.exports = coachingMapper;