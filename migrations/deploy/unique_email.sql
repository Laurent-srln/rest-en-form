-- Deploy osport:unique_email to pg

BEGIN;

ALTER TABLE "user"
ADD CONSTRAINT unique_email UNIQUE (email);

COMMIT;
