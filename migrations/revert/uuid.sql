-- Revert osport:uuid from pg

BEGIN;

BEGIN;

ALTER TABLE "user"
DROP COLUMN token 

COMMIT;

COMMIT;
