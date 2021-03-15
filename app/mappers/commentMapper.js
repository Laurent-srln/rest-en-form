const db = require('../database');

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
        SELECT id, coach_id, workout_id
        FROM comment 
        WHERE workout_id = $1;`, [workoutId]
        )

        return check.rows[0];

    },

    getCommentById : async (commentId) => {

        const check = await db.query(`
        SELECT id, coach_id, workout_id
        FROM comment 
        WHERE id = $1;`, [commentId]    
        )

        return check.rows[0];

    },

    editComment: async (commentId, newContent, coachId) => {

        const result = await db.query(`
        UPDATE comment
        SET content = $1
        WHERE id = $2 
        AND coach_id = $3;`, [newContent, commentId, coachId]
        );

        return result.rows[0];
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