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

        return new User(result.rows[0])
    },

    findAllCoachs : async ()=>{

        const result = await db.query(`SELECT * FROM "user" WHERE "role" = 'COACH';`)

        return result.rows.map(coach => new User(coach));

    },
    
    //modifier pour un user
    findAllWorkoutsByMember: async (m) => {
        const result = await db.query(`
        SELECT u.firstname, w.date, w.content, uc.firstname as coach, "c".created_at, "c".content
        FROM workout w
        LEFT JOIN "user" u ON w.member_id = u.id
        LEFT JOIN "comment" "c" ON w.id = "c".workout_id
        LEFT JOIN "user" uc ON "c".coach_id = uc.id
        ;`)

        return result.rows;
    },




};

module.exports = userMapper;