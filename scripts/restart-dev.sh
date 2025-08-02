#!/bin/bash

# Butterfly Authentique - Restart Local Development Server
# This script properly restarts the local development server

echo "🔄 Restarting local development server..."

# Stop any existing Next.js processes
echo "🛑 Stopping existing development server..."
pkill -f "next dev" || true
sleep 2

# Clean Next.js cache
echo "🧹 Cleaning Next.js cache..."
rm -rf .next
rm -rf out

# Start development server
echo "🚀 Starting development server..."
npm run dev 