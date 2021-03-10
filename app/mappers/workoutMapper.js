const Workout = require('../models/workout');
const db = require('../database');

const workoutMapper = {

    findAllWorkoutsByMember: async (id) => {

        const result = await db.query(`
        SELECT w.id, w.date, w.content as description, w.created_at, w.updated_at, member.id as member_id, member.firstname as member_firstname, member.lastname as member_lastname, h.weight, h.muscle_mass, h.fat_mass, h.bone_mass, h.body_water, coach.id as comment_coach_id, coach.firstname as comment_coach_firstname, coach.lastname as comment_coach_lastname, "c".content as comment_content, "c".created_at as comment_date
        FROM workout w
        LEFT JOIN health h ON w.id = h.workout_id
        LEFT JOIN "user" member ON w.member_id = member.id
        LEFT JOIN "comment" "c" ON w.id = "c".workout_id
        LEFT JOIN "user" coach ON "c".coach_id = coach.id
        WHERE w.member_id = $1;`
        , [id])

        if(!result.rows.length){
            throw new Error("pas de workout pour le membre avec l'id" + id)
        }

        return result.rows.map(workout => new Workout(workout));
    },

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
        FROM new_workout_id RETURNING workout_id
        ;
        `, [workout.date, workout.content, memberId, workout.weight, workout.muscleMass, workout.fatMass, workout.boneMass, workout.bodyWater]);

        workout.id = newWorkout.rows[0].workout_id;
        
        return workout;

    },    
    
    findWorkout: async (workoutId) => {

        const result = await db.query(`
        
        SELECT id, member_id
        FROM workout
        WHERE id = $1;`, [workoutId]
); 
return result.rows[0];

    },



    deleteWorkout: async (workoutId, memberId) => {

        await db.query(`
        
        DELETE FROM workout
        WHERE id = $1
        AND member_id = $2;`, [workoutId, memberId]
); 
return;

    },

    findComment : async (workoutId) => {

        const check = await db.query(`
        SELECT id
        FROM comment 
        WHERE workout_id = $1;`, [workoutId]
)

        return check.rows[0];

    },

    addComment : async (content, coachId, workoutId) => {

        const newComment = await db.query(`
        INSERT INTO comment ("content", coach_id, workout_id)
        VALUES ($1, $2, $3) RETURNING *;`, [content, coachId, workoutId]
);

        return newComment.rows[0];
    }
};

module.exports = workoutMapper;