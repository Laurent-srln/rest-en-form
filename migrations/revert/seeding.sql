-- Revert osport:seeding from pg

BEGIN;

TRUNCATE TABLE "coach_has_specialty" CASCADE;

TRUNCATE TABLE "user" CASCADE;

TRUNCATE TABLE "specialty" CASCADE;

TRUNCATE TABLE "workout" CASCADE;

TRUNCATE TABLE "comment" CASCADE;

COMMIT;
