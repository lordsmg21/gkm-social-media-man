-- Initialize database with extensions and basic setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_client_id ON projects("clientId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tasks_project_id ON tasks("projectId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_files_uploaded_by ON files("uploadedBy");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_id ON messages("conversationId");
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participants);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_client_date ON analytics("clientId", date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_client_id ON invoices("clientId");

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gkm_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gkm_user;