#!/bin/bash

# Butterfly Authentique - Hero Image Setup Script
echo "🦋 Butterfly Authentique - Hero Image Setup"
echo "=============================================="

# Check if image file exists
if [ -f "public/hero-butterfly-authentique.jpg" ]; then
    echo "✅ Hero image found: public/hero-butterfly-authentique.jpg"
    echo "📏 File size: $(ls -lh public/hero-butterfly-authentique.jpg | awk '{print $5}')"
    echo "🎨 Your promotional image is ready to display!"
    echo ""
    echo "🌐 Visit http://localhost:9000/ to see your hero section"
else
    echo "❌ Hero image not found: public/hero-butterfly-authentique.jpg"
    echo ""
    echo "📸 To add your promotional image:"
    echo "1. Copy your image file to: public/hero-butterfly-authentique.jpg"
    echo "2. Recommended size: 1920x1080px or larger"
    echo "3. Format: JPG or PNG"
    echo ""
    echo "💡 Example command:"
    echo "   cp /path/to/your/promotional-image.jpg public/hero-butterfly-authentique.jpg"
    echo ""
    echo "🔄 After adding the image, refresh your browser at http://localhost:9000/"
fi

echo ""
echo "📚 For detailed instructions, see: HERO_IMAGE_SETUP.md" 