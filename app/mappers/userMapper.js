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
//modifier pour un user
    findAllWorkouts: async () => {
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