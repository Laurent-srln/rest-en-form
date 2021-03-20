const { config } = require('process');
const workoutMapper = require('../mappers/workoutMapper');
const commentMapper = require('../mappers/commentMapper');

const jsonwebtoken = require('jsonwebtoken');

const commentController = {

    addComment: async (req,res) => {

            try {
        let { workoutId } = req.params;
        workoutId = Number(workoutId);
        const { content } = req.body;
        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));

        const checkWorkout = await workoutMapper.getWorkoutById(workoutId);

        if (!checkWorkout) {
            res.status(400).json({"message": "Cet entraînement est introuvable."});
            return;
        }

        const check = await commentMapper.getCommentByWorkoutId(workoutId);

        if (check.id) {
           return res.status(400).json({"message": "Un commentaire existe déjà pour cet entraînement."})
        }

        await commentMapper.addComment(content, userId, workoutId);
        const workout = await workoutMapper.getWorkoutById(workoutId);

        return res.status(200).json({"message": "Le commentaire bien été ajouté.", "workout": workout});
    } catch(err) {
        res.status(400).json({"message": err.message});
        }

    },

    editComment: async (req,res) => {
        
        try {
            let { commentId } = req.params;
            commentId = Number(commentId);
            const { content } = req.body;
            const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));

            const comment = await commentMapper.getCommentById(commentId);

            if (!comment) {
                return res.status(200).json({"message": "Ce commentaire est introuvable."});
            }

            if (comment.coachId !== userId) {
                return res.status(200).json({"message": "Vous ne pouvez pas modifier ce commentaire."});
            }

            await commentMapper.editComment(commentId, content, userId);
            const workout = await workoutMapper.getWorkoutById(comment.workoutId);

            return res.status(200).json({"message": "Le commentaire a bien été modifié.", "workout": workout});


        } catch(err) {
            res.status(400).json({"message": err.message});
            }

    },

    deleteComment: async (req,res) => {
        
        try {
            let { commentId } = req.params;
            commentId = Number(commentId);
            const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));

            const check = await commentMapper.getCommentById(commentId);

            if (!check) {
                return res.status(404).json({"message": "Ce commentaire est introuvable."});
            }

            if (check.coachId !== userId) {
                return res.status(403).json({"message": "Vous ne pouvez pas supprimer ce commentaire."});
            }

            const workout = await workoutMapper.getWorkoutById(check.workoutId);
            await commentMapper.deleteComment(commentId, userId);

            return res.status(200).json({"message": "Le commentaire a bien été supprimé.", "workout": workout});


        } catch(err) {
            res.status(400).json({"message": err.message});
            }
    }
}

module.exports = commentController;
