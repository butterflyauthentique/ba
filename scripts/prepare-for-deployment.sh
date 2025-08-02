#!/bin/bash

# Script to prepare Next.js app for static export deployment
# This moves dynamic routes to temporary locations so they don't interfere with static export

echo "🔄 Preparing for deployment..."

# Create temporary directories if they don't exist
mkdir -p src/app/_api
mkdir -p src/app/_admin

# Move API routes to temporary location
if [ -d "src/app/api" ]; then
    echo "📁 Moving API routes to temporary location..."
    mv src/app/api/* src/app/_api/ 2>/dev/null || true
    rmdir src/app/api 2>/dev/null || true
fi

# Move admin routes to temporary location
if [ -d "src/app/(admin)" ]; then
    echo "📁 Moving admin routes to temporary location..."
    mv src/app/\(admin\)/* src/app/_admin/ 2>/dev/null || true
    rmdir src/app/\(admin\) 2>/dev/null || true
fi

# Update next.config.js for static export
echo "⚙️ Updating next.config.js for static export..."
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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

echo "✅ Deployment preparation complete!"
echo "📝 Note: Run 'npm run restore-dev' to restore files for local development" 