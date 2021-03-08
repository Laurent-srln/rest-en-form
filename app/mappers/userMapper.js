const User = require('../models/user');
const Workout = require('../models/workout');

const db = require('../database');

const userMapper = {
    findAll: async () => {
        const result = await db.query('SELECT * FROM "user";')

        return result.rows.map(user => new User(user));
    },

    findAllMembers: async () => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email
        FROM "user" u
        WHERE u.role = 'MEMBER'`)

        return result.rows.map(member => new User(member));

        
    },

    findOneMember: async (id) => {
        const result = await db.query(`
        SELECT u.id, u.firstname, u.lastname, u.email
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
        SELECT u.id as user_id, u.firstname, u.lastname, u.email, string_agg(s.name, ',') as specialities
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        GROUP BY u.firstname, u.lastname, u.email, user_id
        ORDER BY u.firstname;
        `)

        return result.rows;

    },

    findOneCoach : async (coachId)=> {

        const result = await db.query(`
        SELECT u.id as user_id, u.firstname, u.lastname, u.email, string_agg(s.name, ',') as specialities
        FROM "user" u 
        LEFT JOIN coach_has_specialty chs ON u.id = chs.coach_id
        LEFT JOIN specialty s ON chs.specialty_id = s.id
        WHERE u.role = 'COACH'
        AND u.id = $1
        GROUP BY u.firstname, u.lastname, u.email, user_id;
        `, [coachId])

        if(!result.rows.length){
            throw new Error ("Pas de coach avec l'user_id : "+ coachId)
        }
        return result.rows[0];
    },
    
    //modifier pour un user
    findAllWorkoutsByMember: async (id) => {

        const result = await db.query(`
        SELECT u.firstname as member_firtname, w.date as workout_date, w.content as description, uc.firstname as coach_firstname, "c".created_at as comment_date, "c".content as comment
        FROM "user" u
        LEFT JOIN workout w ON w.member_id = u.id
        LEFT JOIN "comment" "c" ON w.id = "c".workout_id
        LEFT JOIN "user" uc ON "c".coach_id = uc.id
        WHERE u.role = 'MEMBER'
        AND u.id = $1;`
        , [id])

        if(!result.rows.length){
            throw new Error("pas de workout pour le membre avec l'id" + id)
        }

        return result.rows;
    },

    addUser: async (user) => {

        //! Voir pour modifier pour éviter que le user soit ajouté sans ses spécialité (INSERT INTO user OK mais INSERT INTO coach_has_specialty NOT OK)

        const check = await db.query(`
        SELECT id FROM "user" WHERE email = $1;`, [user.email]);

        if (check.rows.length) {
            throw new Error(`Un utilisateur avec cette adresse email existe déjà. id : ${check.rows[0].id}`)
        }

        const result = await db.query(`
        INSERT INTO "user" ("firstname", "lastname", "email", "role")
        VALUES ($1, $2, $3, $4) RETURNING id;`, [user.firstname, user.lastname, user.email, user.role] 
        );

        user.id = result.rows[0].id;

        if (user.role === "COACH") {

        for (const specialtyId of user.specialities) {
            await db.query(`
        INSERT INTO "coach_has_specialty" (coach_id, specialty_id)
        VALUES ($1, $2);`, [user.id, specialtyId] )
         } ;

        }

        return user;


    }
  
};

module.exports = userMapper;