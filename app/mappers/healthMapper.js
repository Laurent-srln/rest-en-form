const Health = require('../models/health');
const db = require('../database');

const healthMapper = {

    getAllHealthRecordsByMemberId: async (memberId) => {
    
        const result = await db.query(`
        SELECT h.id, h.created_at, h.updated_at, w.id as workout_id, w.date as workout_date, h.weight, h.muscle_mass, h.fat_mass, h.bone_mass, h.body_water, member.id as member_id, member.firstname as member_firstname, member.lastname as member_lastname
        FROM health h
        LEFT JOIN workout w ON h.workout_id = w.id
        LEFT JOIN "user" member ON w.member_id = member.id
        WHERE w.member_id = $1
        ORDER BY w.date ASC;`
        , [memberId])

        if(!result.rows.length){
            throw new Error("Il n'y a pas d'entraînement pour l'adhérent avec l'id" + memberId)
        }

        return result.rows.map(health => new Health(health));
    }
    
};

module.exports = healthMapper;