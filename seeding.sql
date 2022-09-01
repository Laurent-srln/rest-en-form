BEGIN;

TRUNCATE TABLE "coach_has_specialty" CASCADE;

TRUNCATE TABLE "user" CASCADE;

TRUNCATE TABLE "specialty" CASCADE;

TRUNCATE TABLE "workout" CASCADE;

TRUNCATE TABLE "comment" CASCADE;

TRUNCATE TABLE "health" CASCADE;

TRUNCATE TABLE "coaching" CASCADE;



INSERT INTO "user" ("firstname", "lastname", "email", "role")
VALUES
('Sountid', 'Ly', 'sountidly@gmail.com', 'sountid', 'MEMBER'),
('Julien', 'Blotière', 'julienblotiere@live.fr', 'julien', 'MEMBER'),
('Mathilde', 'Frère', 'mathilde.frere1@gmail.com', 'mathilde', 'MEMBER'),
('Gwenaël', 'Cotton', 'gcotton.oclock@gmail.com', 'gwenael', 'MEMBER'),
('Laurent', 'Séraline', 'l.seraline@gmail.com', NULL, 'MEMBER'),
('Jean', 'Prulière', 'j.pruliere@oclock.io', 'jean', 'COACH'),
('Albus', 'Dumbledore', 'contact@hogwarts.com', 'albus', 'COACH'),
('Professeur', 'Chen', 'p.chen@gmail.com', 'professeur', 'COACH'),
('Arnold', 'Schwarzenegger', 't800@wanadoo.com', NULL, 'COACH'),
('Dario', 'Spagnolo', 'dario@oclock.io', 'dario', 'OWNER')
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
(6, 4),
(6, 1),
(6, 3),
(7, 6),
(7, 5),
(8, 2),
(8, 7),
(9, 1),
(9, 3)
;

INSERT INTO "workout" ("date", "content", "member_id")
VALUES
('2021-02-06', '5 séries de 8 répétitions à 120kg au dév couché. 100 tractions et un Murph pour terminer', 1),
('2021-01-23', '1000 abdos lesté (20kg)', 2),
('2021-02-06', '5km de course sur tapis (24 minutes). abdos/gainage', 3)
;

INSERT INTO "comment" ("content", "coach_id", "workout_id")
VALUES
('Hum... Je faisais mieux à 15 ans...', 9, 1),
('Super Mathilde. Avant notre RDV coaching essaies de faire du travail en fractionné.', 7, 3)
;


INSERT INTO "health" ("weight", "muscle_mass", "fat_mass", "bone_mass", "body_water", "workout_id")
VALUES
(85, 80, 10, 10, 50, 1),
(80, 83, 12, 5, 56, 2),
(55, 86, 9, 5, 60, 3);

INSERT INTO "coaching" ("start_time", "end_time", "coach_id", "member_id")
VALUES
('2021-04-05 09:00:00.000000+01', '2021-04-05 09:15:00.000000+01', 8, NULL),
('2021-03-05 09:15:00.000000+01', '2021-03-05 09:30:00.000000+01', 8, NULL),
('2021-04-05 09:30:00.000000+01', '2021-04-05 09:45:00.000000+01', 6, NULL),
('2021-04-05 09:45:00.000000+01', '2021-04-05 10:00:00.000000+01', 6, NULL),
('2021-02-05 09:45:00.000000+01', '2021-02-05 10:00:00.000000+01', 7, 3),
('2021-02-05 09:30:00.000000+01', '2021-02-05 09:45:00.000000+01', 7, 2),
('2021-04-05 09:00:00.000000+01', '2021-04-05 09:15:00.000000+01', 6, NULL),
('2021-03-05 09:15:00.000000+01', '2021-03-05 09:30:00.000000+01', 6, 4),
('2021-04-05 09:30:00.000000+01', '2021-04-05 09:45:00.000000+01', 6, NULL),
('2021-04-05 09:45:00.000000+01', '2021-04-05 10:00:00.000000+01', 6, 5),
('2021-04-05 09:00:00.000000+01', '2021-04-05 09:15:00.000000+01', 7, 1);

COMMIT;

