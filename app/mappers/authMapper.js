const db = require('../database');
const authMapper = {

    addPassword : async (email, password) => {

        await db.query(`
        UPDATE "user"
        SET password = $1
        WHERE "email" = $2;`,
        [password, email]
        )
    },

    checkConnexion : async (email) => {

        const result = await db.query(`
        SELECT u.id, u.email, u.password, u.role
        FROM "user" u
        WHERE "email" = $1;`,
        [email]
        )

        return result.rows[0];
    },

    findUserByEmail : async (email) => {
        const result = await db.query(`
        SELECT u.id, u.email, u.role,
        CASE
        WHEN u.password IS NULL THEN false
        WHEN u.password IS NOT NULL THEN true 
        END
        AS password
        FROM "user" u
        WHERE u.email = $1
        `, [email])

        if(!result.rows.length){
            throw new Error(`l'email ${email} ne correspond à aucun user`)
        }

        return result.rows[0]
    }
}

module.exports = authMapper;