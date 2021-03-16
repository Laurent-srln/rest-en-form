
const userMapper = require('../mappers/userMapper');
const specialtyMapper = require('../mappers/specialtyMapper');
const passwordServices = require('../services/passwordServices');
const emailValidator = require('email-validator');

const { v4: uuidv4 } = require('uuid');


const userController = {

    addUser : async (req, res) => {
       
        
        try {
        
        // Récupération des données du form
        user = req.body
        
        // On teste que tous les champs obligatoires sont bien rempli
            if (!user.email || !user.firstname || !user.lastname || !user.role ) {
                res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis`});
                return;
            };
        
        //On vérifie que l'email récupéré est valide
        const validEmail = emailValidator.validate(user.email);
        
            if (!validEmail){
                res.status(400).json({"message": `email non valide`});
                return;
        };

        // On vérifie que l'email ne correspond pas à un user déja en db
        const checkEmail = await userMapper.getUserByEmail(user.email);

            if (checkEmail.length) {
                res.status(400).json({"message": `Un utilisateur avec cette adresse email existe déjà. id : ${checkEmail[0].id}`})
                return;
        };

        // On génère un token et on l'ajout à l'objet user récupéré du form
            user.token = uuidv4();

        // Si c'est un MEMBER qu'on veut insérer :
            if (user.role === 'MEMBER') {
                const newUser = await userMapper.addUser(user);

                const insertedUser =  await userMapper.getMemberById(newUser.id)
              
                res.status(200).json({"message": `L'utilisateur a bien été ajouté.`, "newUser":  insertedUser});
            };
        
        // Si c'est un COACH :
             if (user.role === 'COACH') {

                if (!user.specialties || !user.specialties.length) {
                    await userMapper.addUser(user);
                }

                else {
                // On récupère les spécialités enregistrées et on stocke leurs id dans un array
                const specialties = await specialtyMapper.getAllSpecialties();
                let specialtiesId = [];


                specialties.forEach(specialty => specialtiesId.push(specialty.id))

                // On parcourt les id envoyés dans le form pour les comparer aux id en db.

                    for (let i = 0; i< user.specialties.length; i++) {
                        if (!specialtiesId.includes(user.specialties[i])) {
                
                            return res.status(400).json({"message": `La spécialité avec l'id ${user.specialties[i]} n'existe pas.`});
                        } 
                    }
                // On insère le user et ses ses specialités en db
                const newCoach = await userMapper.addCoach(user);

                const insertedCoach =  await userMapper.getCoachById(newCoach[0].coach_id)
              
                res.status(200).json({"message": `L'utilisateur a bien été ajouté.`, "newUser": insertedCoach});

                }
            };

            // On envoie un mail au nouveau user avec un lien lui permettant de configurer son password
            await passwordServices.passwordMail(user.token, user.email);
            
        } catch (err) {
            res.status(400).json(err.message);
        }
        ;
    },

    getAllMembers: async (req, res) => {

        try{
        const members = await userMapper.getAllMembers();

        res.json(members)
        }catch(err){
            res.json(err.message)
        }
    },

    getMemberById : async (req, res) => {

        let {id} = req.params;
        id = Number(id);
        
        try{
        const member = await userMapper.getMemberById(id);

        res.json(member);
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    getAllCoachs : async (req, res) => {

        try {
            const coachs = await userMapper.getAllCoachs();
    
    
        res.json(coachs)
        } catch(err){
            res.status(400).json(err.message);
        }
    },

    getCoachById : async (req, res) => {

        let { id } = req.params;
        id = Number(id);

        try{
        const coach = await userMapper.getCoachById(id);
        

        res.json(coach)
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    editUser : async (req, res) => {

        let {id} = req.params;
        id = Number(id);

        const user = req.body;

        if (!user.email || !user.firstname || !user.lastname ) {
            res.status(400).json({"message": `Tous les champs obligatoires doivent être remplis`})
            return;
        };

        if(user.email){

            const validEmail = emailValidator.validate(user.email);
            if (!validEmail){

                res.status(400).json({"message": `email non valide`})
                return;
            };
        }
       
        try {
            
            const userToUpdate = await userMapper.getUserById(id)

            if (userToUpdate.role === 'MEMBER') {

            await userMapper.editUser(id, user);    

            const updatedUser =  await userMapper.getMemberById(id)
              
            res.status(200).json({"message": `L'utilisateur a bien été modifié.`, "updatedUser": updatedUser});
            
            };

        
            // Si c'est un COACH :
             if (userToUpdate.role === 'COACH') {

                 // On récupère les spécialités enregistrées et on stocke leurs id dans un array
                 const specialties= await specialtyMapper.getAllSpecialties();
                 let specialtiesId = [];
                 specialties.forEach(specialty => specialtiesId.push(specialty.id));
 
                 // On parcourt les id envoyés dans le form pour les comparer aux id en db.
                 for (let i = 0; i< user.specialties.length; i++) {
                    if (!specialtiesId.includes(user.specialties[i])) {
            
                        return res.status(400).json({"message": `La spécialité avec l'id ${user.specialties[i]} n'existe pas.`});
                    } 
                }
                
                await userMapper.editCoach(id, user);

                 
                const updatedCoach = await userMapper.getCoachById(id);

                res.status(200).json({"message": `L'utilisateur a bien été modifié.`, "updatedUser": updatedCoach});
            };

        
        }catch (err) {

            res.status(400).json(err.message);
        };
            

    },

    deleteUser : async (req, res) => {

        let {id} = req.params;
        id = Number(id);
        
        try {
        const isUser = await userMapper.getUserById(id);
        
        console.log(isUser);
        if(!isUser) {
            res.status(400).json({"message": "Pas d'utilisateur avec cet id.}"});
        }
        else {

            const deletedUser = await userMapper.getUserById(id);            
            await userMapper.deleteUser(isUser.id);

            res.status(400).json({"message": "Cet user a bien été supprimé", "deletedUser": deletedUser})
        }   
        
    } catch (err) {

        res.status(400).json(err.message);
}

    }

}

module.exports = userController;