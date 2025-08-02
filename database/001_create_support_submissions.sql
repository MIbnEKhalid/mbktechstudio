-- Create support_submissions table for storing all form submissions and tickets
CREATE TABLE IF NOT EXISTS support_submissions (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE,
    
    -- Form data fields
    subject VARCHAR(100) NOT NULL,
    support_type VARCHAR(100),
    project_category VARCHAR(200),
    blog_category VARCHAR(200),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- System fields
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    page_url TEXT,
    submission_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Admin fields
    assigned_to VARCHAR(255),
    admin_notes TEXT,
    resolution_notes TEXT,
    
    -- Audit trail
    audit_trail JSONB DEFAULT '[]'::jsonb,
    
    -- Additional metadata
    additional_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Indexes for performance
    CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed', 'on_hold')),
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_support_submissions_status ON support_submissions(status);
CREATE INDEX IF NOT EXISTS idx_support_submissions_subject ON support_submissions(subject);
CREATE INDEX IF NOT EXISTS idx_support_submissions_email ON support_submissions(email);
CREATE INDEX IF NOT EXISTS idx_support_submissions_timestamp ON support_submissions(submission_timestamp);
CREATE INDEX IF NOT EXISTS idx_support_submissions_ticket_number ON support_submissions(ticket_number);

-- Create trigger to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_submissions_last_updated 
    BEFORE UPDATE ON support_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_last_updated_column();

-- Add some sample data for testing (optional)
INSERT INTO support_submissions (
    ticket_number, subject, support_type, name, email, message, status, audit_trail
) VALUES 
(
    'T000001', 
    'Support', 
    'Technical', 
    'Test User', 
    'test@example.com', 
    'This is a test submission',
    'pending',
    jsonb_build_array(
        jsonb_build_object(
            'type', 'status', 
            'action', 'Submission Created', 
            'timestamp', CURRENT_TIMESTAMP, 
            'by', 'system'
        )
    )
);

DROP TABLE IF EXISTS blocked_entries;

CREATE TABLE blocked_entries (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    value VARCHAR(255) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    
    CONSTRAINT valid_block_type CHECK (type IN ('email', 'phone', 'keyword')),
    CONSTRAINT unique_block UNIQUE (type, value)
);

CREATE INDEX idx_blocked_entries_type_value ON blocked_entries(type, value);
CREATE INDEX idx_blocked_entries_is_active ON blocked_entries(is_active);

INSERT INTO blocked_entries (type, value, reason, created_by) VALUES
('email', 'spam@example.com', 'Known spam account', 'system'),
('phone', '+1234567890', 'Spam calls', 'system'),
('keyword', 'casino', 'Gambling content', 'system');