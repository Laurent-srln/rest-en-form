
const healthMapper = require('../mappers/healthMapper');

const jsonwebtoken = require('jsonwebtoken');

const healthController = {

    getAllHealthRecordsByMemberId: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7))
        try{
        const healthRecords = await healthMapper.getAllHealthRecordsByMemberId(userId);

        res.status(200).json(healthRecords)
    } catch(err) {
        res.status(400).json({"message": err.message});
        }
    }

}

module.exports = healthController;
