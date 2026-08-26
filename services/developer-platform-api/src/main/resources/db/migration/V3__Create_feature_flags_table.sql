CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    flag_key VARCHAR(100) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT uk_feature_flags_project_key UNIQUE (project_id, flag_key),
    CONSTRAINT fk_feature_flags_project_id FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE INDEX idx_feature_flags_project_id ON feature_flags(project_id);
CREATE INDEX idx_feature_flags_key ON feature_flags(flag_key);
