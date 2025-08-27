#!/bin/bash

# GKM Portal Development Setup Script

set -e

echo "🚀 Starting GKM Portal development setup..."

# Create environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating development environment file..."
    cp backend/.env.example backend/.env
    
    # Set development values
    sed -i 's/NODE_ENV=production/NODE_ENV=development/' backend/.env
    sed -i 's/your-super-secure-jwt-secret-key-here-change-in-production/dev-jwt-secret-key/' backend/.env
    
    echo "✅ Development environment file created."
fi

# Start development services (database + API)
echo "🏗️  Starting backend services..."
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 20

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.dev.yml ps

# Display status
echo ""
echo "🎉 GKM Portal development environment ready!"
echo ""
echo "📋 Next Steps:"
echo "   1. Install frontend dependencies: npm install"
echo "   2. Start development server: npm run dev"
echo ""
echo "🌐 Development URLs:"
echo "   Frontend Dev Server: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo ""
echo "👤 Default Accounts:"
echo "   Admin: admin@gkm.com / admin123"
echo "   Client: client@example.com / client123"
echo ""
echo "🔧 Management Commands:"
echo "   View API logs: docker-compose -f docker-compose.dev.yml logs -f backend"
echo "   Stop services: docker-compose -f docker-compose.dev.yml down"
echo ""