const db = require('../database');
const Comment = require('../models/comment');

const commentMapper = {

    addComment : async (content, coachId, workoutId) => {

        const newComment = await db.query(`
        INSERT INTO comment ("content", coach_id, workout_id)
        VALUES ($1, $2, $3) RETURNING *;`, [content, coachId, workoutId]
        );

        return newComment.rows[0];
    },

    getCommentByWorkoutId : async (workoutId) => {

        const check = await db.query(`
        SELECT c.id, c.content, c.coach_id, coach.firstname as coach_firstname, coach.lastname as coach_lastname, workout_id, c.created_at, c.updated_at
        FROM comment c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        WHERE c.workout_id = $1;`, [workoutId]
        )

        return new Comment(check.rows[0]);

    },

    getCommentById : async (commentId) => {

        const result = await db.query(`
        SELECT c.id, c.content, c.coach_id, coach.firstname as coach_firstname, coach.lastname as coach_lastname, workout_id, c.created_at, c.updated_at
        FROM comment c
        LEFT JOIN "user" coach ON c.coach_id = coach.id
        WHERE c.id = $1;`, [commentId]    
        )

        if(!result.rows.length){
            throw new Error("Il n'y a pas de commentaire avec cet id.")
        }

        return new Comment( result.rows[0]);

    },

    editComment: async (commentId, newContent, coachId) => {

        const result = await db.query(`
        UPDATE comment
        SET content = $1
        WHERE id = $2 
        AND coach_id = $3;`, [newContent, commentId, coachId]
        );

        return;
    },

    deleteComment: async (commentId, coachId) => {

        await db.query(`
        DELETE FROM comment
        WHERE id = $1 
        AND coach_id = $2;`, [commentId, coachId]
        );
         return;
    }
};

module.exports = commentMapper;