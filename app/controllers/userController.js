
const userMapper = require('../mappers/userMapper');
const specialtyMapper = require('../mappers/specialtyMapper');
const passwordMail = require('../services/passwordMail');
const emailValidator = require('email-validator');

const { v4: uuidv4 } = require('uuid');


const userController = {
    allMembers: async (req, res) => {

        try{
        const members = await userMapper.findAllMembers();

        res.json(members)
        }catch(err){
            res.json(err.message)
        }
    },

    oneMember : async (req, res) => {

        const {id} = req.params;
        
        try{
        const member = await userMapper.findOneMember(id);

        res.json(member);
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    allCoachs : async (req, res) => {

        try {
            const coachs = await userMapper.findAllCoachs();
    
    
        res.json(coachs)
        } catch(err){
            res.status(400).json(err.message);
        }
    },

    oneCoach : async (req, res) => {

        const {id} = req.params

        try{
        const coach = await userMapper.findOneCoach(id);
        console.log(coach);

        res.json(coach)
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    newUser : async (req, res) => {
       
        
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
        const checkEmail = await userMapper.findMemberByEmail(user.email);

            if (checkEmail.length) {
                res.status(400).json({"message": `Un utilisateur avec cette adresse email existe déjà. id : ${checkEmail[0].id}`})
                return;
        };

        // On génère un token et on l'ajout à l'objet user récupéré du form
            user.token = uuidv4();

        // Si c'est un MEMBER qu'on veut insérer :
            if (user.role === 'MEMBER') {
                await userMapper.addUser(user);
            };
        
        // Si c'est un COACH :
             if (user.role === 'COACH') {

                if (!user.specialties || !user.specialties.length) {
                    await userMapper.addUser(user);
                }

                else {
                // On récupère les spécialités enregistrées et on stocke leurs id dans un array
                const specialties= await specialtyMapper.findAllSpecialties();
                let specialtiesId = [];
                specialties.forEach(specialty => specialtiesId.push(specialty.id))
                console.log("specialtiesId :", specialtiesId);

                // On parcourt les id envoyés dans le form pour les comparer aux id en db.
                user.specialties.forEach( specialty => {
                    if (!specialtiesId.includes(specialty)) {
                        res.status(400).json({"message": `La spécialité avec l'id ${specialty} n'existe pas.`})
                        return;
                    }});
           
                await userMapper.addCoach(user);
                }
            };

        // On envoie un mail au nouveau user avec un lien lui permettant de configurer son password
            await passwordMail(user.token, user.email);

            res.status(200).json({"message": `L'utilisateur a bien été ajouté.`});

        } catch (err) {
            res.status(400).json(err.message);
        };
    },

    deleteUser : async (req, res) => {

        const {id} = req.params;
        
        const isUser = await userMapper.findOneUser(id);
        
        if(!isUser) {
            res.status(400).json("Pas de user à cet id, veuillez en entrer un valide")
        }
        else {

            await userMapper.deleteOneUser(isUser.id);

            res.json("Cet user a bien été supprimé")
        }   
        
    },

    editUser : async (req, res) => {

        const {id} = req.params;

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
            
            const userToUpdate = await userMapper.findOneUser(id)

            if(!userToUpdate){

                res.status(400).json("Pas de user à cet id, veuillez en entrer un valide")
            }
            else{

                await userMapper.updateOneUser(id, user);

                res.status(200).json({ "message" : `le user avec l'id ${id} a bien été mis à jour`, user});
            }
      
        } catch (err) {
            res.status(400).json(err.message);
        };
   
    }
 
}

module.exports = userController;