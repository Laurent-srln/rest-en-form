const Workout = require('../models/workout');

const db = require('../database');

const workoutMapper = {

    addWorkout : async (workout, memberId) => {

        const newWorkout = await db.query(`
        
        with new_workout_id as (
        INSERT INTO workout ("date", content, member_id)
        VALUES ($1, $2, $3) RETURNING id)
        
        INSERT INTO health ("weight", muscle_mass, fat_mass, bone_mass, body_water, workout_id)
        SELECT $4, $5, $6, $7, $8, "id"
        FROM new_workout_id RETURNING workout_id
        ;
        `, [workout.date, workout.content, memberId, workout.weight, workout.muscleMass, workout.fatMass, workout.boneMass, workout.bodyWater]);

        workout.id = newWorkout.rows[0].workout_id;
        
        return workout;

    }
    
};

module.exports = workoutMapper;