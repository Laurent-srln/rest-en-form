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

        return result.rows;
    },

    save: async (newCoachings) => {

        for (i = newCoachings.startTime; newCoachings.endTime > i; i += interval '15 minutes' )
        // toutes les données en commun sont préparées
        const data = [
            thePost.slug,
            thePost.title,
            thePost.excerpt,
            thePost.content
        ];

        const query = `
                INSERT INTO "coaching" ("start_time", "end_time", "coach_id", "member_id")
                SELECT $1, $2, $3, $4, id
                FROM category
                WHERE label = $5
                RETURNING id;
            `;

            data.push(thePost.category);
        }

        // je ne pioche que les données parmi l'objet result qui m'est retourné
        try {
            // insérer le post et récupérer son id
            const { rows } = await db.query(query, data);

            // l'affecter au post
            thePost.id = rows[0].id;

            // pas besoin de le retourner car il est passé par référence, donc l'objet d'origine est modifié
        } catch (err) {
            throw new Error("Un article avec ce slug existe déjà");
        }
    }
    
};

module.exports = coachingMapper;