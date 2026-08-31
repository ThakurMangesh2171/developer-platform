CREATE TABLE webhook_endpoints (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    url VARCHAR(1024) NOT NULL,
    signing_secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_webhook_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_webhook_project_id ON webhook_endpoints(project_id);
