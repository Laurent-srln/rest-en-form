const db = require('../database');
const authMapper = {

    getToken: async (token) => {
        result = await db.query(`
        
        SELECT id
        FROM "user"
        WHERE "token" = $1`,
        [token]
        );

        return result.rows[0];
    },

    getUserAuthInfo : async (email) => {

        const result = await db.query(`
        SELECT u.id, u.email, u.password, u.role
        FROM "user" u
        WHERE lower(email) = $1;`,
        [email.toLowerCase()]
        )
        console.log(email)
        return result.rows[0];
    },

    getUserByEmail : async (email) => {
        const result = await db.query(`
        SELECT u.id, u.email, u.role,
        CASE
        WHEN u.password IS NULL THEN false
        WHEN u.password IS NOT NULL THEN true 
        END
        AS password
        FROM "user" u
        WHERE low u.email = $1
        `, [email])

        if(!result.rows.length){
            throw new Error(`L'email ${email} ne correspond à aucun utilisateur.`)
        }

        return result.rows[0]
    },

    setPassword : async (token, password) => {

        console.log({"token": token, "password":password});

        await db.query(`

        UPDATE "user"
        SET password = $1, token = NULL
        WHERE "token" = $2`,
        [password, token]
        )
    }

}

module.exports = authMapper;