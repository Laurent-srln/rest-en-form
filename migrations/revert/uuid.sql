-- Revert osport:uuid from pg

BEGIN;

ALTER TABLE "user"
DROP COLUMN token;

COMMIT;
