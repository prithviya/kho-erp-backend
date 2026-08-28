CREATE TABLE IF NOT EXISTS onboarding_education_details (
    oeid INT AUTO_INCREMENT PRIMARY KEY,
    cifid INT NOT NULL,
    qualification VARCHAR(150) NULL,
    institution VARCHAR(200) NULL,
    board VARCHAR(200) NULL,
    year VARCHAR(20) NULL,
    percentage VARCHAR(50) NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    INDEX idx_onboard_edu_cifid (cifid),
    CONSTRAINT fk_onboard_edu_record_cifid
        FOREIGN KEY (cifid)
        REFERENCES onboarding_records (cifid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS onboarding_experience_details (
    oexid INT AUTO_INCREMENT PRIMARY KEY,
    cifid INT NOT NULL,
    company VARCHAR(200) NULL,
    designation VARCHAR(150) NULL,
    startDate DATE NULL,
    endDate DATE NULL,
    totalExp VARCHAR(50) NULL,
    reason TEXT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    INDEX idx_onboard_exp_cifid (cifid),
    CONSTRAINT fk_onboard_exp_record_cifid
        FOREIGN KEY (cifid)
        REFERENCES onboarding_records (cifid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
