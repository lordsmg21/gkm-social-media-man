#!/bin/bash

# GKM Portal Production Deployment Script

set -e

echo "🚀 Starting GKM Portal production deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating environment file..."
    cp backend/.env.example backend/.env
    
    # Generate secure JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/your-super-secure-jwt-secret-key-here-change-in-production/$JWT_SECRET/" backend/.env
    
    echo "✅ Environment file created. Please review backend/.env before continuing."
    echo "🔑 Generated secure JWT secret."
fi

# Create SSL directory for future use
mkdir -p ssl

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Test database connection
echo "🗄️  Testing database connection..."
docker-compose exec -T postgres pg_isready -U gkm_user -d gkm_portal

# Seed database
echo "🌱 Seeding database with initial data..."
docker-compose exec -T backend node -e "
const { sequelize } = require('./src/config/database');
const { seedDatabase } = require('./src/utils/seed');

async function init() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
    
    await seedDatabase();
    console.log('Database seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

init();
"

# Display status
echo ""
echo "🎉 GKM Portal deployed successfully!"
echo ""
echo "📋 Service Status:"
docker-compose ps
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:5000/api"
echo "   Nginx Proxy: http://localhost"
echo ""
echo "👤 Default Accounts:"
echo "   Admin: admin@gkm.com / admin123"
echo "   Client: client@example.com / client123"
echo ""
echo "🔧 Management Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
echo "📖 For more information, see README.md"
echo ""