CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token TEXT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cats (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    birth_date VARCHAR(50) NOT NULL,
    cat_type VARCHAR(100) NULL,
    owner_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_cats_owner FOREIGN KEY (owner_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE daily_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cat_id BIGINT NOT NULL,
    cat_name_snapshot VARCHAR(255) NOT NULL,
    defecation BIT NOT NULL,
    vitamin BIT NOT NULL,
    weight DOUBLE NOT NULL,
    etc TEXT NULL,
    log_date VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_daily_logs_cat_log_date UNIQUE (cat_id, log_date),
    CONSTRAINT fk_daily_logs_cat FOREIGN KEY (cat_id) REFERENCES cats (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE medical_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cat_id BIGINT NOT NULL,
    cat_name_snapshot VARCHAR(255) NOT NULL,
    health_checkup_date VARCHAR(50) NOT NULL,
    health_cycle INT NOT NULL,
    heart_worm VARCHAR(50) NOT NULL,
    heart_worm_cycle INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_medical_logs_cat UNIQUE (cat_id),
    CONSTRAINT fk_medical_logs_cat FOREIGN KEY (cat_id) REFERENCES cats (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
