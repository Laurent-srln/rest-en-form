const Specialty = require('../models/specialty');
const db = require('../database');


const specialtyMapper = {

    addSpecialty : async (newSpecialty)=> {

        const check = await db.query(`
        SELECT *
        FROM "specialty" 
        WHERE lower(name) = $1`, [newSpecialty.toLowerCase()]
        )
        
        if (check.rows.length) {
            
            throw new Error(`Cette spécialité existe déjà. id : ${check.rows[0].id}`)
        };

        const result = await db.query(`
        INSERT INTO "specialty"
        (name)
        VALUES($1) RETURNING id;`, [newSpecialty]);

        return new Specialty(result.rows[0]);

    },

    findAllSpecialties : async ()=> {

        const result = await db.query(`
        SELECT * 
        FROM specialty`)

        if(!result.rows) {

            throw new Error(`Aucune spécialité`);
        }
        return result.rows.map(specialty=> new Specialty(specialty) )
    },

    deleteOneSpecialty : async (id)=>{

        const check = await db.query(`
        SELECT * 
        FROM "specialty"
        WHERE id = $1`, [id])

        if(!check.rows[0]) {
            throw new Error(`Pas de spécialité à cet id ${id}`);
        }
        
        const result = await db.query(`
            DELETE
            FROM "specialty"
            WHERE id = $1 `, [id]);
        
    }
};

module.exports = specialtyMapper;