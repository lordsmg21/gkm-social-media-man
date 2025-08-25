# GKM Portal - Complete Deployment Setup

## 📋 Project Overview

GKM Portal is a premium social media management portal for Gilton Karso Media with a glassmorphism design. The platform serves two user types: GKM admin team and their clients, focusing on Facebook and Instagram management with advanced project tracking and file collaboration.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Socket.IO
- **Database**: PostgreSQL 15 with full-text search
- **Cache/Sessions**: Redis
- **File Storage**: Local filesystem with multer
- **Deployment**: Docker + Docker Compose
- **Proxy**: Nginx (production)

## 🚀 Quick Start (Development)

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd gkm-portal
```

### 2. Environment Configuration
Copy the environment file and customize:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your settings:
```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=gkm_portal
DB_USER=gkm_user
DB_PASS=your-secure-password-here

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Start Development Environment
```bash
# Start backend services only (database + API)
docker-compose -f docker-compose.dev.yml up -d

# Install frontend dependencies and start dev server
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Database**: localhost:5432

## 🔧 Production Deployment

### 1. Environment Setup
Create production environment file:
```bash
cp backend/.env.example backend/.env.production
```

Update production settings:
```env
NODE_ENV=production
JWT_SECRET=your-super-secure-production-jwt-secret-here
DB_PASS=your-secure-database-password
FRONTEND_URL=https://your-domain.com
```

### 2. Build and Deploy
```bash
# Build and start all services
docker-compose up -d --build

# Check status
docker-compose ps
```

### 3. Initial Setup
The application will automatically:
- Create database tables
- Seed with default admin and demo users
- Set up proper indexes

### 4. Access Points
- **Application**: http://localhost (via Nginx)
- **API**: http://localhost/api
- **Direct Frontend**: http://localhost:3000
- **Direct Backend**: http://localhost:5000

## 👤 Default Users

### Admin Account
- **Email**: `admin@gkm.com`
- **Password**: `admin123`
- **Role**: Admin (full access)

### Demo Client Account  
- **Email**: `client@example.com`
- **Password**: `client123`
- **Role**: Client (limited access)

## 🛠️ Available Services

### Backend Services
```bash
# View logs
docker-compose logs -f backend

# Access backend container
docker-compose exec backend sh

# Restart backend
docker-compose restart backend
```

### Database Management
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U gkm_user -d gkm_portal

# Backup database
docker-compose exec postgres pg_dump -U gkm_user gkm_portal > backup.sql

# Restore database
docker-compose exec -T postgres psql -U gkm_user gkm_portal < backup.sql
```

### Frontend Development
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔒 Security Features

- JWT authentication with secure tokens
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- File type validation and size limits
- CORS protection
- Security headers via Helmet
- Input validation and sanitization

## 📁 File Upload System

### Supported File Types
- Documents: PDF, DOC, DOCX, TXT
- Images: JPG, PNG, GIF, WEBP, SVG
- Videos: MP4, MOV, AVI
- Archives: ZIP, RAR

### File Size Limits
- Maximum file size: 200MB
- Storage location: `/app/uploads`
- Automatic file type validation

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/demo-accounts` - Get demo credentials

### Users
- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project (admin only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (admin only)

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)

### Files
- `GET /api/files` - List files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file

### Messages
- `GET /api/messages/conversations` - List conversations
- `POST /api/messages/conversations` - Create conversation
- `GET /api/messages/conversations/:id/messages` - Get messages
- `POST /api/messages/conversations/:id/messages` - Send message

### Analytics
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics` - Create/update analytics (admin only)
- `GET /api/analytics/dashboard` - Dashboard summary

### Billing
- `GET /api/billing` - List invoices
- `POST /api/billing` - Upload invoice (admin only)
- `GET /api/billing/:id/download` - Download invoice

## 🔧 Configuration

### Environment Variables

#### Required
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` - Database connection
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)

#### Optional
- `NODE_ENV` - Environment mode (development/production)
- `JWT_EXPIRES_IN` - Token expiration (default: 24h)
- `MAX_FILE_SIZE` - Upload limit (default: 200MB)
- `REDIS_HOST`, `REDIS_PORT` - Redis connection
- `FRONTEND_URL` - CORS origin

### Docker Volumes
- `postgres_data` - Database storage
- `redis_data` - Redis storage  
- `backend_uploads` - File uploads

## 🔍 Monitoring & Logs

### Health Checks
All services include health checks:
- **Backend**: `GET /api/health`
- **Database**: `pg_isready`
- **Redis**: `redis-cli ping`

### Log Management
```bash
# View all logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis
```

## 🛡️ Backup & Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U gkm_user gkm_portal > "backup-$(date +%Y%m%d).sql"

# Scheduled backup (add to crontab)
0 2 * * * cd /path/to/project && docker-compose exec postgres pg_dump -U gkm_user gkm_portal > "backup-$(date +\%Y\%m\%d).sql"
```

### File Backup
```bash
# Backup uploads
docker run --rm -v gkm_backend_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz -C /data .

# Restore uploads
docker run --rm -v gkm_backend_uploads:/data -v $(pwd):/backup alpine tar xzf /backup/uploads-backup.tar.gz -C /data
```

## 🚀 Production Optimization

### Performance
- Nginx gzip compression
- Static asset caching
- Database connection pooling
- Redis session management

### Security
- SSL/TLS termination at Nginx
- Rate limiting per endpoint
- Security headers
- File upload restrictions

### Scaling
- Horizontal scaling ready
- Load balancer compatible
- Stateless backend design
- Database read replicas support

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check postgres logs
docker-compose logs postgres

# Verify credentials
docker-compose exec postgres psql -U gkm_user -d gkm_portal
```

#### File Upload Issues  
```bash
# Check upload directory permissions
docker-compose exec backend ls -la uploads/

# Check disk space
docker system df
```

#### Frontend Build Fails
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version compatibility
node --version
```

### Support
For issues and questions:
- Check logs: `docker-compose logs -f [service-name]`
- Verify configuration: `docker-compose config`
- Test connectivity: `docker-compose exec [service] ping [other-service]`

## 📝 Development Workflow

### Adding New Features
1. Update backend API routes
2. Add database models/migrations
3. Update frontend components
4. Test in development environment
5. Build and deploy to production

### Code Structure
```
gkm-portal/
├── backend/              # Node.js API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Auth & validation
│   │   └── utils/        # Helpers
│   └── Dockerfile
├── src/                  # React frontend
│   ├── components/       # React components
│   └── assets/           # Static assets
├── docker-compose.yml    # Production setup
├── docker-compose.dev.yml # Development setup
└── README.md
```

This complete setup provides a production-ready social media management portal with all necessary services, security measures, and deployment configurations. The application includes user management, project tracking, file sharing, real-time messaging, and analytics - all packaged in a scalable Docker environment.