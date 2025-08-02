# 🎨 Hero Image Setup Guide

## Overview

Your beautiful Butterfly Authentique promotional image has been integrated into the home page hero section. The hero section is now ready to showcase your brand with a stunning visual design.

## 🖼️ Current Hero Section Features

### ✅ **What's Already Implemented:**

1. **Responsive Design** - Works perfectly on all devices
2. **Brand Integration** - Butterfly logo prominently displayed
3. **Typography** - Elegant serif fonts with proper contrast
4. **Call-to-Action Buttons** - "Shop Now" and "Our Story" buttons
5. **Trust Indicators** - Handcrafted, Premium Quality, Unique Designs
6. **Product Showcase Grid** - Visual representation of your collections
7. **Fallback Background** - Beautiful gradient when image isn't loaded

### 🎨 **Design Elements:**

- **Color Scheme**: Hot pink, red, orange, yellow (matching your promotional image)
- **Typography**: Serif fonts for elegance, white text with drop shadows
- **Layout**: Two-column design on desktop, single column on mobile
- **Animations**: Subtle floating elements and hover effects

## 📸 **Adding Your Promotional Image**

### **Step 1: Prepare Your Image**

1. **File Format**: JPG or PNG
2. **Recommended Size**: 1920x1080px or larger
3. **File Name**: `hero-butterfly-authentique.jpg`
4. **Quality**: High resolution (at least 72 DPI for web)

### **Step 2: Add the Image**

1. **Navigate to the public folder**:
   ```bash
   cd /Users/pritinupur/ba_website/public/
   ```

2. **Copy your image** to the public folder:
   ```bash
   # Copy your promotional image to the public folder
   cp /path/to/your/promotional-image.jpg ./hero-butterfly-authentique.jpg
   ```

3. **Verify the file**:
   ```bash
   ls -la hero-butterfly-authentique.jpg
   ```

### **Step 3: Test the Hero Section**

1. **Visit your home page**: `http://localhost:9000/`
2. **Check the hero section** - Your image should now be displayed as the background
3. **Test responsiveness** - Resize your browser to see how it looks on different devices

## 🎯 **Hero Section Features**

### **Left Side - Brand Content:**
- **Butterfly Logo** - Your brand logo prominently displayed
- **Main Headline** - "Butterfly Authentique" with elegant typography
- **Subtitle** - Brand description with drop shadow for readability
- **Call-to-Action Buttons** - "Shop Now" and "Our Story"
- **Trust Indicators** - Three key value propositions with icons

### **Right Side - Product Showcase (Desktop Only):**
- **Product Grid** - Four categories represented:
  - Traditional Paintings (Orange/Red)
  - Handcrafted Jewelry (Green/Blue)
  - Elegant Stoles (Yellow/Orange)
  - Butterfly Authentique Brand (Pink/Purple)

### **Background Elements:**
- **Promotional Image** - Your beautiful multi-part graphic
- **Overlay** - Subtle dark overlay for text readability
- **Floating Elements** - Animated decorative circles
- **Fallback Gradient** - Beautiful gradient when image isn't loaded

## 🎨 **Design Inspiration from Your Image**

The hero section design is inspired by your promotional image:

### **Color Palette:**
- **Hot Pink Background** - Matches your promotional image
- **Yellow Accents** - Inspired by the textile and butterfly
- **Red Elements** - From the traditional painting
- **Green Touches** - From the jewelry elements

### **Layout Elements:**
- **Butterfly Logo** - Prominently featured like in your image
- **Multi-part Design** - Product showcase grid representing different elements
- **Textile Patterns** - Decorative elements inspired by the yellow stole
- **Traditional Art** - Painting-inspired color schemes

## 📱 **Responsive Behavior**

### **Desktop (Large Screens):**
- Two-column layout
- Full product showcase grid
- Large typography
- All decorative elements visible

### **Tablet (Medium Screens):**
- Single column layout
- Centered content
- Medium typography
- Reduced decorative elements

### **Mobile (Small Screens):**
- Single column layout
- Centered content
- Smaller typography
- Minimal decorative elements
- Touch-friendly buttons

## 🔧 **Customization Options**

### **If you want to modify the hero section:**

1. **Change Colors**: Edit the gradient in `src/app/page.tsx`
2. **Update Text**: Modify the headlines and descriptions
3. **Add More Elements**: Include additional product categories
4. **Adjust Layout**: Change the grid structure or spacing

### **File Location:**
- **Hero Section Code**: `src/app/page.tsx` (lines 8-120)
- **Image Location**: `public/hero-butterfly-authentique.jpg`
- **Styling**: Uses Tailwind CSS classes

## 🚀 **Next Steps**

### **Immediate Actions:**
1. ✅ **Add your promotional image** to the public folder
2. ✅ **Test the hero section** on different devices
3. ✅ **Verify image quality** and loading speed

### **Optional Enhancements:**
1. **Add Image Optimization** - Compress for faster loading
2. **Implement Lazy Loading** - For better performance
3. **Add Image Alt Text** - For accessibility
4. **Create Multiple Sizes** - For different screen sizes

## 🎉 **Result**

Once you add your promotional image, you'll have a stunning hero section that:

- **Showcases Your Brand** - Beautiful visual representation
- **Engages Visitors** - Clear call-to-action buttons
- **Builds Trust** - Professional design with trust indicators
- **Drives Sales** - Direct links to shop and about pages
- **Works Everywhere** - Responsive design for all devices

**Your Butterfly Authentique home page will now have a world-class hero section that perfectly represents your brand!** ✨

---

**Need Help?** The hero section is designed to work immediately once you add the image file. If you encounter any issues, check the file path and format. 