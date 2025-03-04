CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   username VARCHAR(255) UNIQUE NOT NULL,
   password_hash VARCHAR(255) NOT NULL,
   role VARCHAR(255),
   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS challenges (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id VARCHAR(255) NOT NULL,
   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   published BOOLEAN NOT NULL DEFAULT FALSE,
   ctfd_id INTEGER DEFAULT NULL,
   verified BOOLEAN NOT NULL DEFAULT FALSE,
);
--    flag VARCHAR(255) NOT NULL

CREATE TABLE IF NOT EXISTS instances (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
   player_id VARCHAR(255) NOT NULL,
   token VARCHAR(255) NOT NULL,
   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
