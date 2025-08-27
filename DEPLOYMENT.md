# Add these to your package.json scripts for easy deployment

# Local development (requires Docker)
npm run dev:setup      # Start backend services and setup database
npm run dev            # Start frontend development server

# Production deployment (requires Docker)
npm run deploy:prod    # Deploy full production environment
npm run deploy:stop    # Stop all services
npm run deploy:logs    # View service logs

# Database management
npm run db:backup      # Backup database
npm run db:restore     # Restore database from backup

# Service management
npm run services:start # Start all services
npm run services:stop  # Stop all services  
npm run services:restart # Restart all services