CREATE TABLE IF NOT EXISTS developer_platform.url_clicks (
    id UUID PRIMARY KEY,
    shortened_url_id UUID NOT NULL REFERENCES developer_platform.short_urls(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_url_clicks_shortened_url_id ON developer_platform.url_clicks(shortened_url_id);
CREATE INDEX idx_url_clicks_clicked_at ON developer_platform.url_clicks(clicked_at);
