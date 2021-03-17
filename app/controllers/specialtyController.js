const specialtyMapper = require('../mappers/specialtyMapper');

const specialtyController = {

    addSpecialty: async (req, res) => {

        const newSpecialty = req.body.name;

        if (!newSpecialty) {
            res.status(400).json({
                "message": "Veuillez saisir une spécialité"
            });
            return;
        }

        try {
            const specialty = await specialtyMapper.addSpecialty(newSpecialty);

            res.status(200).json({
                "message": "La spécialité a bien été ajoutée.",
                "specialité": specialty
            });
        } catch (err) {
            res.status(400).json({
                "message": err.message
            });
        }
    },

    getAllSpecialties: async (req, res) => {

        try {
            const result = await specialtyMapper.getAllSpecialties();

            res.status(200).json(result)
        } catch (err) {
            res.status(400).json({
                "message": err.message
            });
        }
    },

    deleteSpecialty: async (req, res) => {

        let {
            id
        } = req.params;
        id = Number(id);

        try {

            const result = await specialtyMapper.deleteSpecialtyById(id);

            res.status(200).json({
                "message": "La spécialité a bien été supprimée.",
                "specialty": result
            });
        } catch (err) {
            res.status(400).json({
                "message": err.message
            });
        }
    }


}

module.exports = specialtyController;