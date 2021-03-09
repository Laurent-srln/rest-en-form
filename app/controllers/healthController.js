
const healthMapper = require('../mappers/healthMapper');

const jsonwebtoken = require('jsonwebtoken');

const healthController = {

    allHealthRecordsByMember: async (req, res) => {

        const {userId} = jsonwebtoken.decode(req.headers.authorization.substring(7))
        try{
        const healthRecords = await healthMapper.findAllHealthRecordsByMember(userId);

        res.json(healthRecords)
        }catch(err){
            res.status(400).json(err.message);
        }
    }

}

module.exports = healthController;
