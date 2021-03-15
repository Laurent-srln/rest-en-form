-- Revert osport:unique_email from pg

BEGIN;

ALTER TABLE "user"
DROP CONSTRAINT unique_email;

COMMIT;
