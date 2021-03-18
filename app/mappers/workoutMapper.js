const Workout = require('../models/workout');
const db = require('../database');

const workoutMapper = {

    addWorkout : async (workout, memberId) => {

        const check = await db.query(`
        SELECT u.id
        FROM "user" u
        WHERE u.role = 'MEMBER'
        AND u.id = $1;`
        , [memberId])

        if(!check.rows[0]) {

            throw new Error(`Cet id ${memberId} ne correspond pas à un Member`);
        }

        const newWorkout = await db.query(`
        
        with new_workout_id as (
        INSERT INTO workout ("date", content, member_id)
        VALUES ($1, $2, $3) RETURNING id)
        
        INSERT INTO health ("weight", muscle_mass, fat_mass, bone_mass, body_water, workout_id)
        SELECT $4, $5, $6, $7, $8, "id"
        FROM new_workout_id
        RETURNING workout_id as id
        ;
        `, [workout.date, workout.content, memberId, workout.weight, workout.muscleMass, workout.fatMass, workout.boneMass, workout.bodyWater]);

        
        return newWorkout.rows[0] ;

    },

    getAllWorkoutsByMemberIdId: async (id) => {

        const result = await db.query(`
        SELECT w.id, w.date, w.content as description, w.created_at, w.updated_at, member.id as member_id, member.firstname as member_firstname, member.lastname as member_lastname, h.weight, h.muscle_mass, h.fat_mass, h.bone_mass, h.body_water, coach.id as comment_coach_id, coach.firstname as comment_coach_firstname, coach.lastname as comment_coach_lastname, "c".content as comment_content, "c".created_at as comment_date
        FROM workout w
        LEFT JOIN health h ON w.id = h.workout_id
        LEFT JOIN "user" member ON w.member_id = member.id
        LEFT JOIN "comment" "c" ON w.id = "c".workout_id
        LEFT JOIN "user" coach ON "c".coach_id = coach.id
        WHERE w.member_id = $1
        ORDER BY w.date DESC;`
        , [id])

        if(!result.rows.length){
            throw new Error("pas de workout pour le membre avec l'id" + id)
        }

        return result.rows.map(workout => new Workout(workout));
    },

    getWorkoutById: async (workoutId) => {

        const result = await db.query(`
        
        SELECT w.id, w.date, w.content as description, w.created_at, w.updated_at, member.id as member_id, member.firstname as member_firstname, member.lastname as member_lastname, h.weight, h.muscle_mass, h.fat_mass, h.bone_mass, h.body_water, coach.id as comment_coach_id, coach.firstname as comment_coach_firstname, coach.lastname as comment_coach_lastname, "c".content as comment_content, "c".created_at as comment_date
        FROM workout w
        LEFT JOIN health h ON w.id = h.workout_id
        LEFT JOIN "user" member ON w.member_id = member.id
        LEFT JOIN "comment" "c" ON w.id = "c".workout_id
        LEFT JOIN "user" coach ON "c".coach_id = coach.id
        WHERE w.id = $1;`, [workoutId]
        ); 

        if(!result.rows){
            throw new Error(`Pas de workout avec l'id : ${workoutId}`)}

            return new Workout (result.rows[0]);

    },

    editWorkout: async (workoutId, updatedWorkout) => {

        await db.query(`
        
        with updated_workout as (UPDATE workout
        SET date = $1, content = $2
        WHERE id = $3 RETURNING *)
        
        UPDATE health
        SET weight = $4, muscle_mass = $5, fat_mass = $6, bone_mass = $7, body_water = $8
        FROM updated_workout
        WHERE health.workout_id = $3
        ;
        `, [updatedWorkout.date, updatedWorkout.content, workoutId, updatedWorkout.weight, updatedWorkout.muscleMass, updatedWorkout.fatMass, updatedWorkout.boneMass, updatedWorkout.bodyWater]);
        
        return;

    },

    deleteWorkout: async (workoutId, memberId) => {

        await db.query(`
        
        DELETE FROM workout
        WHERE id = $1
        AND member_id = $2;`, [workoutId, memberId]
        ); 
    return;

    }
};

module.exports = workoutMapper;