INSERT INTO "user" ("firstname", "lastname", "email", "role")
VALUES
('Sountid', 'Ly', 'sountidly@gmail.com', 'MEMBER'),
('Julien', 'Blotière', 'julienblotiere@live.fr', 'MEMBER'),
('Mathilde', 'Frère', 'mathilde.frere1@gmail.com', 'MEMBER'),
('Gwenaël', 'Cotton', 'gcotton.oclock@gmail.com', 'MEMBER'),
('Laurent', 'Séraline', 'l.seraline@gmail.com', 'MEMBER'),
('Jean', 'Prulière', 'j.pruliere@oclock.io', 'COACH'),
('Albus', 'Dumbledore', 'contact@hogwarts.com', 'COACH'),
('Professeur', 'Chen', 'p.chen@gmail.com', 'COACH'),
('Arnold', 'Schwarzenegger', 't800@wanadoo.com', 'COACH'),
('Dario', 'Spagnolo', 'dario@oclock.io', 'OWNER')
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