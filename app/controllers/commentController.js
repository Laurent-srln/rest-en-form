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
            res.status(200).json("Ce workout est introuvable.");
            return;
        }

        const check = await commentMapper.getCommentByWorkoutId(workoutId);

        if (check) {
           return res.status(200).json("Un commentaire existe déjà pour ce workout.")
        }

        const newComment = await commentMapper.addComment(content, userId, workoutId);

        return res.status(200).json("Commentaire bien ajouté au workout");
    } catch (err) {
        res.status(400).json(err.message);

        } 

    },

    editComment: async (req,res) => {
        
        try {
            let { commentId } = req.params;
            commentId = Number(commentId);
            const { content } = req.body;
            const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));

            const check = await commentMapper.getCommentById(commentId);

            if (!check) {
                return res.status(200).json("Ce commentaire est introuvable.");
            }

            if (check.coach_id !== userId) {
                return res.status(200).json("Vous ne pouvez pas modifier ce commentaire.");
            }

            const newComment = await commentMapper.editComment(commentId, content, userId);

            return res.status(200).json("Le commentaire a bien été modifié");


        } catch (err) {
            res.status(400).json(err.message);
    
            } 
    },

    deleteComment: async (req,res) => {
        
        try {
            let { commentId } = req.params;
            commentId = Number(commentId);
            const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7));

            const check = await commentMapper.getCommentById(commentId);

            if (!check) {
                return res.status(404).json("Ce commentaire est introuvable.");
            }

            if (check.coach_id !== userId) {
                return res.status(403).json("Vous ne pouvez pas supprimer ce commentaire.");
            }

            await commentMapper.deleteComment(commentId, userId);

            return res.status(200).json("Le commentaire a bien été supprimé.");


        } catch (err) {
            res.status(400).json(err.message);
    
            } 
    }
}

module.exports = commentController;
