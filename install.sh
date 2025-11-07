#!/bin/bash

# HuParfum Installation Script
# Automated setup for Linux/Mac environments

set -e

echo "HuParfum - Installation Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js v18 or higher first."
    exit 1
fi

echo "[OK] Node.js installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed. Please install npm first."
    exit 1
fi

echo "[OK] npm installed: $(npm --version)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "[WARNING] MySQL is not installed. You need to set up MySQL before running the application."
    exit 1
fi

echo "[OK] MySQL installed"
echo ""

# Backend setup
echo "[INFO] Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "[INFO] Creating .env file from template..."
    cp .env.example .env
    echo "[WARNING] Please edit backend/.env with your database, email, and Telegram credentials"
fi

echo "[INFO] Installing backend dependencies..."
npm install

cd ..

# Frontend setup
echo ""
echo "[INFO] Setting up Frontend..."
cd frontend

echo "[INFO] Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "========================================"
echo "[OK] Installation completed successfully!"
echo ""
echo "[INFO] Next Steps:"
echo ""
echo "1. Configure backend/.env with your credentials:"
echo "   - Database connection"
echo "   - Email service (Gmail SMTP)"
echo "   - Telegram Bot tokens"
echo ""
echo "2. Create the database:"
echo "   mysql -u root -p huparfum_db < database/schema.sql"
echo ""
echo "3. Start the backend server:"
echo "   cd backend && npm start"
echo ""
echo "4. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "[INFO] For more information, read README.md"
echo ""
