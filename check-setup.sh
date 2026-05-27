#!/bin/bash

echo "🔍 Social Media Platform Setup Verification"
echo "=========================================="

# Check if Node.js is installed
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
echo ""
echo "🗄️  Checking MongoDB..."
if pgrep mongod > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB not running. Please start MongoDB:"
    echo "   Option 1 (Atlas): Update MONGO_URI in server/.env"
    echo "   Option 2 (Local): brew services start mongodb-community"
fi

# Check backend dependencies
echo ""
echo "🔧 Checking backend dependencies..."
cd server
if [ -d "node_modules" ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies missing. Run: cd server && npm install"
fi

# Check frontend dependencies
echo ""
echo "🎨 Checking frontend dependencies..."
cd ../client
if [ -d "node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies missing. Run: cd client && npm install"
fi

echo ""
echo "🚀 To start the application:"
echo "1. Terminal 1: cd server && npm run dev"
echo "2. Terminal 2: cd client && npm run dev"
echo "3. Open http://localhost:5174 in your browser"

cd ..
echo ""
echo "📝 Remember to update server/.env with your MongoDB connection string!"