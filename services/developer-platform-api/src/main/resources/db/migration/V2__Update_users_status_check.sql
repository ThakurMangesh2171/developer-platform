-- Drop the old constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_status;

-- Add the new constraint matching the UserStatus enum
ALTER TABLE users ADD CONSTRAINT chk_users_status 
CHECK (status IN ('ACTIVE', 'PENDING_VERIFICATION', 'LOCKED', 'INACTIVE', 'SUSPENDED', 'ARCHIVED'));
