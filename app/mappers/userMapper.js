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

    addUser: async (user) => {

        //! Voir pour modifier pour éviter que le user soit ajouté sans ses spécialité (INSERT INTO user OK mais INSERT INTO coach_has_specialty NOT OK)

        const check = await db.query(`
        SELECT id FROM "user" WHERE lower(email) = $1;`, [user.email.toLowerCase()]);

        if (check.rows.length) {
            
            throw new Error(`Un utilisateur avec cette adresse email existe déjà. id : ${check.rows[0].id}`)
        }

        const result = await db.query(`
        INSERT INTO "user" ("firstname", "lastname", "email", "role", "token")
        VALUES ($1, $2, $3, $4, $5) RETURNING id;`, [user.firstname, user.lastname, user.email.toLowerCase(), user.role, user.token] 
        );

        user.id = result.rows[0].id;

        if (user.role === "COACH") {

        for (const specialtyId of user.specialties) {
            await db.query(`
        INSERT INTO "coach_has_specialty" (coach_id, specialty_id)
        VALUES ($1, $2);`, [user.id, specialtyId] )
         } ;

        }

        return new User(user);
    },

    findOneUser : async (id) => {
        const result = await db.query(`
        SELECT * 
        FROM "user"
        WHERE id = $1`, [id])
        
        return result.rows[0]
    },

    deleteOneUser : async (id) =>{

    
        const check = await db.query(`
        SELECT role
        FROM "user"
        WHERE id = $1`, [id])

        if(check.rows[0].role === "MEMBER"){
            
            await db.query(`
            UPDATE "coaching"
            SET member_id = NULL
            WHERE member_id = $1`, [id])   
        }
        
           const result = await db.query(`
            DELETE FROM "user"
            WHERE id =$1`,[id])
        
        return result;     
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