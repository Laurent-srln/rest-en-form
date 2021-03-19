const User = require('../models/user');
const Workout = require('../models/workout');

const db = require('../database');
const { totalCount } = require('../database');

const userMapper = {

    addUser: async (user) => {
     
        const result = await db.query(`
        INSERT INTO "user" ("firstname", "lastname", "email", "role", "token")
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [user.firstname, user.lastname, user.email.toLowerCase(), user.role, user.token] 
        );

        return result.rows[0];
    },

    addCoach: async (user) => {

        if (user.specialties.length > 0) {

        let query = `
        with 
        new_coach as (INSERT INTO "user" ("firstname", "lastname", "email", "role", "token")
        VALUES ($1, $2, $3, $4, $5) RETURNING id)

        INSERT INTO "coach_has_specialty" (coach_id, specialty_id)
        VALUES
        ((SELECT "id" FROM new_coach), $6)`;
        
        for (i=1; i<user.specialties.length; i++) {
         query += `, ((SELECT "id" FROM new_coach), $${i+6})`
        } ;

        query += ` RETURNING coach_id as id`;
     
        const result = await db.query(query, [user.firstname, user.lastname, user.email.toLowerCase(), user.role, user.token, ...user.specialties ] 
        );
        
        return result.rows;
        }

    },

    getUserById : async (id) => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.role, u.created_at, u.updated_at
        FROM "user" u
        WHERE id = $1`, [id])

        if(!result.rows[0]) {

            throw new Error(`Cet id ne correspond à aucun utilisateur.`);
        }
        
        return new User(result.rows[0])
    },

    getAllMembers: async () => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.role, u.created_at, u.updated_at
        FROM "user" u
        WHERE u.role = 'MEMBER'
        ORDER BY u.firstname, u.lastname`)

        return result.rows.map(member => new User(member));

    },

    getMemberById: async (id) => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.role, u.created_at, u.updated_at
        FROM "user" u
        WHERE u.role = 'MEMBER'
        AND u.id = $1;`
        , [id])

        if(!result.rows[0]) {

            throw new Error(`Cet id ${id} ne correspond pas à un adhérent.`);
        }

        return new User(result.rows[0])
    },

    getUserByEmail : async (email) => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.role, u.created_at, u.updated_at
        FROM "user" u 
        WHERE lower(u.email) = $1;`,
         [email.toLowerCase()]
    );
    if(!result.rows[0]) {

        return;
    }
        return new User(result.rows[0])
    },

    getAllCoachs : async ()=>{

        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.role, string_agg(s.name, ',') as specialties, u.created_at, u.updated_at
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        GROUP BY u.firstname, u.lastname, u.email, u.id
        ORDER BY u.firstname, u.lastname;
        `)
        result.rows.forEach( coach => {

            if (coach.specialties) {
            coach.specialties = coach.specialties.split(",")}
        })
        return result.rows.map(coach => new User(coach));

    },

    getCoachById : async (coachId)=> {

        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.role, string_agg(s.name, ',') as specialties, u.created_at, u.updated_at
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        AND u.id = $1
        GROUP BY u.firstname, u.lastname, u.email, u.id;
        `, [coachId])

        if(!result.rows.length){
            throw new Error ("Pas de coach avec l'id : "+ coachId)
        }

        result.rows[0].specialties = result.rows[0].specialties.split(",");
        return new User (result.rows[0]);
    },

    setNewToken : async (email, token) => {

        await db.query(`
        UPDATE "user"
        SET token = $1
        WHERE email = $2;`, [token, email])

        return;
    },

    editUser : async (id, user) => {

        await db.query(`
        UPDATE "user"
        SET firstname = $1,
        lastname = $2,
        email = $3
        WHERE id = $4
        RETURNING *;
      `, [user.firstname, user.lastname, user.email, id]);

        return;    
        
    },

    editCoach : async (id, user) => {

        let query = `
        with 
        updated_coach as (UPDATE "user"
        SET firstname = $1,
        lastname =$2,
        email=$3
        WHERE id = $4
        RETURNING id),
        deleted_specialty as (DELETE FROM "coach_has_specialty"
        WHERE coach_id = $4)

        
        INSERT INTO "coach_has_specialty" (coach_id, specialty_id)
        VALUES
        ((SELECT "id" FROM updated_coach), $5)`;
                
        for (i=1; i<user.specialties.length; i++) {
         query += `, ((SELECT "id" FROM updated_coach), $${i+5})`
        } ;
                
        await db.query(query, [user.firstname, user.lastname, user.email.toLowerCase(),id, ...user.specialties ] 
        ); 

        return;
    },
    
    deleteUser : async (id) => {

            await db.query(`
            with deleted_user as (
                DELETE FROM "user"
                WHERE id = $1 RETURNING id)
            UPDATE "coaching"
            SET member_id = NULL
            WHERE member_id = (SELECT id FROM deleted_user);`, [id]);
            
            return;
    
    }
};

module.exports = userMapper;