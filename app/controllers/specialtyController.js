const specialtyMapper = require('../mappers/specialtyMapper');

const specialtyController = {

    allspecialties : async (req, res)=> {
        
        try{
        const result = await specialtyMapper.findAllSpecialties();

        res.status(200).json(result)
        }catch(err){
            res.status(400).json(err.message); 
        }    
    },

    newSpecialty : async (req, res)=>{

        const newSpecialty = req.body.name;
        
        if (!newSpecialty){
            res.status(400).json("Veuillez entrer une spécialité");
            return;
        }

        try{
            const specialty = await specialtyMapper.addSpecialty(newSpecialty);

            res.status(200).json(specialty);
        }catch(err){
            res.status(400).json(err.message);
        }
    },

    deleteSpecialty : async (req, res) => {

        const {id} = req.params;

        try{

            const result = await specialtyMapper.deleteOneSpecialty(id);

            res.status(200).json("spécialité bien supprimée");
        }catch(err){

            res.status(400).json(err.message);
        }
    }
 
    
}

module.exports = specialtyController;