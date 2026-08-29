ALTER TABLE onboarding_documents
ADD COLUMN IF NOT EXISTS file_url VARCHAR(512) NULL AFTER fileName;
