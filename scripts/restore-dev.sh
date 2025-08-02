#!/bin/bash

# Script to restore Next.js app for local development
# This moves dynamic routes back to their original locations

echo "🔄 Restoring for local development..."

# Restore API routes
if [ -d "src/app/_api" ]; then
    echo "📁 Restoring API routes..."
    mkdir -p src/app/api
    mv src/app/_api/* src/app/api/ 2>/dev/null || true
    rmdir src/app/_api 2>/dev/null || true
fi

# Restore admin routes
if [ -d "src/app/_admin" ]; then
    echo "📁 Restoring admin routes..."
    mkdir -p src/app/\(admin\)
    mv src/app/_admin/* src/app/\(admin\)/ 2>/dev/null || true
    rmdir src/app/_admin 2>/dev/null || true
fi

# Update next.config.js for local development
echo "⚙️ Updating next.config.js for local development..."
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
EOF

echo "✅ Local development restoration complete!"
echo "🚀 You can now run 'npm run dev' for local development" 