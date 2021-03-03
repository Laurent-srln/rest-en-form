-- Revert osport:init from pg

BEGIN;

DROP TABLE coaching;

DROP TABLE health;

DROP TABLE comment;

DROP TABLE workout;

DROP TABLE coach_has_specialty;

DROP TABLE specialty;

DROP TABLE "user";

DROP DOMAIN posint;

COMMIT;
