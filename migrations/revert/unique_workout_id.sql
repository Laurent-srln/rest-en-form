-- Revert osport:unique_workout_id from pg

BEGIN;

ALTER TABLE comment
DROP CONSTRAINT unique_workout_id UNIQUE;

COMMIT;
