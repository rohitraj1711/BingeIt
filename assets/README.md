# Stremio App Assets Guide

## 🎬 Cinema Clapperboard Theme

Your app now uses a cinema clapperboard theme with red (#dc2626) and black colors.

## 📁 Required Image Files

Place these files in the `assets/images/` folder:

### 1. App Icon (`icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Content**: Cinema clapperboard logo with red and black theme
- **Background**: Solid background (not transparent)
- **Use**: Home screen app icon

### 2. Splash Screen (`splash.png`) 
- **Size**: 1242x2436 pixels (iPhone X size) or larger
- **Format**: PNG
- **Content**: Your clapperboard logo centered on dark background
- **Background**: Dark blue (#0f0f23)
- **Use**: Loading screen when app opens

### 3. Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparent background
- **Content**: Clapperboard logo (keep within center 672x672 safe area)
- **Use**: Android adaptive icon

## 🎨 Design Guidelines

- **Main Colors**: Red (#dc2626), Black (#000), Dark Blue (#0f0f23)
- **Style**: Cinema/movie theme with clapperboard design
- **Logo**: Film clapperboard with black and red stripes
- **Typography**: Bold, clean fonts

## 🚀 Quick Test Setup

For testing, you can:
1. Create any 3 PNG images
2. Rename them to: `icon.png`, `splash.png`, `adaptive-icon.png`
3. Place in `assets/images/` folder
4. Run `npx react-native start --reset-cache`

## ✨ What's Implemented

- ✅ ClapperboardLogo component created
- ✅ Landing page updated with cinema theme
- ✅ App configuration updated for dark theme
- ✅ Red color scheme throughout app
- ✅ Professional movie streaming branding

Your Stremio app now has a complete cinema theme ready for your custom logo assets! 🎬