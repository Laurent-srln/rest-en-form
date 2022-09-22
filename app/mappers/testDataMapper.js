const db = require('../database');

const testDataMapper = {
    resetData : async () => {
        await db.query(`
        BEGIN;

TRUNCATE TABLE "coach_has_specialty" CASCADE;

TRUNCATE TABLE "user" CASCADE;

TRUNCATE TABLE "specialty" CASCADE;

TRUNCATE TABLE "workout" CASCADE;

TRUNCATE TABLE "comment" CASCADE;

TRUNCATE TABLE "health" CASCADE;

TRUNCATE TABLE "coaching" CASCADE;

ALTER SEQUENCE user_id_seq RESTART WITH 1;
ALTER SEQUENCE specialty_id_seq RESTART WITH 1;
ALTER SEQUENCE coach_has_specialty_id_seq RESTART WITH 1;
ALTER SEQUENCE workout_id_seq RESTART WITH 1;
ALTER SEQUENCE comment_id_seq RESTART WITH 1;
ALTER SEQUENCE health_id_seq RESTART WITH 1;
ALTER SEQUENCE coaching_id_seq RESTART WITH 1;


INSERT INTO "user" ("firstname", "lastname", "email", "password", "role")
VALUES
('Laurent', 'Séraline', 'owner@gmail.com', '$2b$10$mHhLq4aq05flSG0S3/HB9ue6cTZN.g4nOV94l/4fKlnP0Ewg.nYn2', 'OWNER'),
('John', 'Doe', 'member1@gmail.com', '$2b$10$mHhLq4aq05flSG0S3/HB9ue6cTZN.g4nOV94l/4fKlnP0Ewg.nYn2', 'MEMBER'),
('Juliette', 'Laborde', 'member2@gmail.com', '$2b$10$mHhLq4aq05flSG0S3/HB9ue6cTZN.g4nOV94l/4fKlnP0Ewg.nYn2', 'MEMBER'),
('Alex', 'Térieur', 'coach1@gmail.com', '$2b$10$mHhLq4aq05flSG0S3/HB9ue6cTZN.g4nOV94l/4fKlnP0Ewg.nYn2', 'COACH'),
('Alain', 'Proviste', 'coach2@gmail.com', '$2b$10$mHhLq4aq05flSG0S3/HB9ue6cTZN.g4nOV94l/4fKlnP0Ewg.nYn2', 'COACH')

;

INSERT INTO "specialty" ("name")
VALUES
('Musculation'),
('Rééducation'),
('Haltérophilie'),
('Gymnastique'),
('Cardio'),
('Electrostimulation'),
('Nutrition')
;

INSERT INTO "coach_has_specialty" ("coach_id", "specialty_id")
VALUES
(4, 4),
(4, 1),
(4, 3),
(5, 6),
(5, 5),
(5, 2)
;

INSERT INTO "workout" ("date", "content", "member_id")
VALUES
('2021-02-06', '5 séries de 8 répétitions à 120kg au dév couché, 4 séries de 12 tractions et un peu de gainage', 2),
('2021-01-23', 'Murph : 1h10', 2),
('2021-02-06', '5km de course sur tapis (24 minutes). abdos/gainage', 3)
;

INSERT INTO "comment" ("content", "coach_id", "workout_id")
VALUES
('Bravo. bla bla bla', 4, 1),
('Super entraînement ! bla bla bla', 5, 3)
;


INSERT INTO "health" ("weight", "muscle_mass", "fat_mass", "bone_mass", "body_water", "workout_id")
VALUES
(85, 80, 10, 10, 50, 1),
(80, 83, 12, 5, 56, 2),
(55, 86, 9, 5, 60, 3);

INSERT INTO "coaching" ("start_time", "end_time", "coach_id", "member_id")
VALUES
('2023-06-23 09:00:00.000000+01', '2021-04-05 09:15:00.000000+01', 4, NULL),
('2023-06-23 09:15:00.000000+01', '2021-03-05 09:30:00.000000+01', 4, 2),
('2023-06-23 09:30:00.000000+01', '2021-04-05 09:45:00.000000+01', 4, NULL),
('2023-06-23 09:45:00.000000+01', '2021-04-05 10:00:00.000000+01', 4, NULL),
('2023-06-23 09:30:00.000000+01', '2021-04-05 09:45:00.000000+01', 5, NULL),
('2023-06-23 09:45:00.000000+01', '2021-04-05 10:00:00.000000+01', 5, NULL),
('2023-06-24 09:45:00.000000+01', '2021-02-05 10:00:00.000000+01', 5, 3),
('2023-06-24 10:00:00.000000+01', '2021-02-05 10:15:00.000000+01', 5, 2),
('2023-06-24 10:15:00.000000+01', '2021-04-05 10:30:00.000000+01', 5, NULL),
('2023-06-24 10:30:00.000000+01', '2021-02-05 10:45:00.000000+01', 5, NULL);

COMMIT;
        `
)

return;

    }
};

module.exports = testDataMapper;