const User = require('../models/user');
const Workout = require('../models/workout');

const db = require('../database');

const userMapper = {
    findAllMembers: async () => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.created_at, u.updated_at
        FROM "user" u
        WHERE u.role = 'MEMBER'`)

        return result.rows.map(member => new User(member));

    },

    findOneMember: async (id) => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, u.created_at, u.updated_at
        FROM "user" u
        WHERE u.role = 'MEMBER'
        AND u.id = $1;`
        , [id])

        if(!result.rows[0]) {

            throw new Error(`Cet id ${id} ne correspond pas à un Member`);
        }

        return new User(result.rows[0])
    },

    findMemberByEmail : async (email) => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email
        FROM "user" u 
        WHERE lower(u.email) = $1;`,
         [email.toLowerCase()]
    );

        return result.rows;
    },

    findAllCoachs : async ()=>{

        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, string_agg(s.name, ',') as specialties, u.created_at, u.updated_at
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        GROUP BY u.firstname, u.lastname, u.email, u.id
        ORDER BY u.firstname;
        `)
        result.rows.forEach( coach => {

            if (coach.specialties) {
            coach.specialties = coach.specialties.split(",")}
        })
        return result.rows.map(coach => new User(coach));

    },

    findOneCoach : async (coachId)=> {

        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email, string_agg(s.name, ',') as specialties, u.created_at, u.updated_at
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        AND u.id = $1
        GROUP BY u.firstname, u.lastname, u.email, u.id;
        `, [coachId])

        if(!result.rows.length){
            throw new Error ("Pas de coach avec l'user_id : "+ coachId)
        }

        result.rows[0].specialties = result.rows[0].specialties.split(",");
        return new User (result.rows[0]);
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
        
        console.log(query)
     
        await db.query(query, [user.firstname, user.lastname, user.email.toLowerCase(), user.role, user.token, ...user.specialties ] 
        );

        }

        return;
    },


    addUser: async (user) => {
     
        const result = await db.query(`
        INSERT INTO "user" ("firstname", "lastname", "email", "role", "token")
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [user.firstname, user.lastname, user.email.toLowerCase(), user.role, user.token] 
        );

        return result.rows[0];
    },

    findOneUser : async (id) => {
        const result = await db.query(`
        SELECT * 
        FROM "user"
        WHERE id = $1`, [id])
        
        return result.rows[0]
    },

    deleteOneUser : async (id) => {

            await db.query(`
            with deleted_user as (
                DELETE FROM "user"
                WHERE id = $1 RETURNING id)
            UPDATE "coaching"
            SET member_id = NULL
            WHERE member_id = (SELECT id FROM deleted_user);`, [id]);
            
            return
    
    },
    updateOneUser : async (id, user)=> {

        await db.query(`

        UPDATE "user"
        SET firstname = $1,
        lastname = $2,
        email = $3
        WHERE id = $4
        ;`, [user.firstname, user.lastname, user.email.toLowerCase(), id]
        )

            //! A modifier, il faut tester le role en db pas celui transmi par la request
            
        if(user.role === "COACH"){

        await db.query (`
        DELETE FROM
        "coach_has_specialty"
        WHERE coach_id = $1`, [id]
        )

            for (const specialtyId of user.specialties) {

            await db.query(`
            INSERT INTO "coach_has_specialty" (coach_id, specialty_id)
            VALUES ($1, $2);`, [id, specialtyId] 
            )

            } ;
          
        }
        return new User(user);
    },

  
};

module.exports = userMapper;