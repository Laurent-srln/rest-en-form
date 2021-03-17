-- Revert osport:trigger_timestamp from pg

BEGIN;

DROP TRIGGER set_timestamp_coach_has_specialty ON coach_has_specialty;

DROP TRIGGER set_timestamp_coaching ON coaching;

DROP TRIGGER set_timestamp_comment ON comment;

DROP TRIGGER set_timestamp_health ON health;

DROP TRIGGER set_timestamp_specialty ON specialty;

DROP TRIGGER set_timestamp_user ON "user";

DROP TRIGGER set_timestamp_workout ON workout;

DROP FUNCTION trigger_set_timestamp();

COMMIT;
