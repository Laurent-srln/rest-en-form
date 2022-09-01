-- Deploy osport:unique_workout_id to pg

BEGIN;

ALTER TABLE comment
ADD CONSTRAINT unique_workout_id UNIQUE (workout_id);

COMMIT;
