const testDataMapper = require('../mappers/testDataMapper');

const testDataController = {
    resetApp : async (req, res) =>{
        await testDataMapper.resetData();
        res.status(200).json({"message": `L'application a bien été réinitialisée.`});
    }
}

module.exports = testDataController;