-- Deploy osport:init to pg

BEGIN;

CREATE DOMAIN posint AS int CHECK (value > 0);

CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    "password" text,
    "role" text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE specialty (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE coach_has_specialty (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    coach_id int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    specialty_id int NOT NULL REFERENCES specialty(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE workout (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "date" date NOT NULL,
    content text NOT NULL,
    member_id int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE comment (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content text NOT NULL,
    coach_id int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    workout_id int UNIQUE NOT NULL REFERENCES workout(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE health (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "weight" posint NOT NULL,
    muscle_mass posint NOT NULL,
    fat_mass posint NOT NULL,
    bone_mass posint NOT NULL,
    body_water posint NOT NULL,
    workout_id int NOT NULL REFERENCES workout(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

CREATE TABLE coaching (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    coach_id int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    member_id int REFERENCES "user"(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

COMMIT;
