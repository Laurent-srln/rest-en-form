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
            res.status(400).json({"message": "Ce workout est introuvable."});
            return;
        }

        const check = await commentMapper.getCommentByWorkoutId(workoutId);

        if (check.length) {
           return res.status(400).json({"message": "Un commentaire existe déjà pour ce workout."})
        }

        await commentMapper.addComment(content, userId, workoutId);

        return res.status(200).json({"message": "Commentaire bien ajouté au workout"});
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

            return res.status(200).json({"message": "Le commentaire a bien été modifié"});


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

            await commentMapper.deleteComment(commentId, userId);

            return res.status(200).json({"message": "Le commentaire a bien été supprimé."});


        } catch(err) {
            res.status(400).json({"message": err.message});
            }
    }
}

module.exports = commentController;
