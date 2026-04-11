#!/bin/bash
# SCMS Redeployment Script (Docker)

echo "🚀 Starting Redeployment..."

# Pull latest changes
git pull origin main

# Build and restart containers
docker-compose down
docker-compose up --build -d

# Apply database migration (Safe for existing databases)
echo "📥 Applying Staff Role migration..."
docker exec -i scms-db mysql -u root -pkiudbpass!23 scms_db < database/migrations/001_add_dept_officer.sql

echo "✅ Deployment Successful!"
