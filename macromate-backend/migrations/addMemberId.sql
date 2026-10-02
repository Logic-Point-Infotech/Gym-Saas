-- macromate-backend/migrations/addMemberId.sql
ALTER TABLE users ADD COLUMN member_id VARCHAR(20) UNIQUE NULL;
ALTER TABLE users ADD COLUMN date_of_birth DATE NULL;
ALTER TABLE users ADD COLUMN address TEXT NULL;
ALTER TABLE users ADD COLUMN emergency_contact VARCHAR(100) NULL;
CREATE UNIQUE INDEX idx_member_id ON users(member_id);
