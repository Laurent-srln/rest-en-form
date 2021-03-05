const User = require('../models/user');
const Workout = require('../models/workout');

const db = require('../database');

const userMapper = {
    findAll: async () => {
        const result = await db.query('SELECT * FROM "user";')

        return result.rows.map(user => new User(user));
    },

    findAllMembers: async () => {
        const result = await db.query(`SELECT * FROM "user" WHERE "role" = 'MEMBER';`)

        return result.rows.map(member => new User(member));

        
    },

    findOneMember: async (id) => {
        const result = await db.query(`SELECT * FROM "user" WHERE "id" = $1`, [id])

        if(!result.rows[0]) {

            throw new Error("Pas de Member avec l'id " + id);
        }

        return new User(result.rows[0])
    },

    findAllCoachs : async ()=>{

        const result = await db.query(`
        SELECT u.firstname, u.lastname, u.email, string_agg(s.name, ' - ') as specialities
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        GROUP BY u.firstname, u.lastname, u.email;
        `)

        return result.rows.map(coach => new User(coach));

    },

    findOneCoach : async (coachId)=> {

        const result = await db.query(`
        SELECT u.firstname, u.lastname, u.email, s.name as specialities
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        AND u.id = $1
        `, [coachId])

        if(!result.rows.length){
            throw new Error ("Pas de coach avec l'user_id : "+ coachId)
        }
        return result.rows
    },
    
    //modifier pour un user
    findAllWorkoutsByMember: async (id) => {

        const result = await db.query(`
        SELECT u.firstname, w.date, w.content, uc.firstname as coach, "c".created_at, "c".content
        FROM "user" u
        LEFT JOIN workout w ON w.member_id = u.id
        LEFT JOIN "comment" "c" ON w.id = "c".workout_id
        LEFT JOIN "user" uc ON "c".coach_id = uc.id
        WHERE u.role = 'MEMBER'
        AND u.id = $1;`
        , [id])

        if(!result.rows.length){
            throw new Error("pas de workout pour le membre avec l'id" + id)
        }

        return result.rows;
    },

    addUser: async (user) => {

        const result = await db.query(`
        INSERT INTO "user" ("firstname", "lastname", "email", "role")
        VALUES ($1, $2, $3, $4) RETURNING id;`, [user.firstname, user.lastname, user.email, user.role] 
        );

        user.id = result.rows[0].id;

        return user;


    },

    
};

module.exports = userMapper;