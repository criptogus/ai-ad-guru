
#!/bin/bash

# Comprehensive build fix script
echo "🔧 Starting comprehensive build fix process..."

# Create node_modules directory if doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Creating node_modules directory..."
  mkdir -p node_modules
fi

# Apply direct fix to Rollup native module
echo "📦 Applying direct fix to Rollup native module..."
node native-module-fix.js

# Set environment variables
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true 
export PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION=true
export PUPPETEER_SKIP_BROWSER_DOWNLOAD=true
export PUPPETEER_PRODUCT=none
export BROWSER=none
export PUPPETEER_EXECUTABLE_PATH=/bin/true
export ROLLUP_NATIVE=false
export ROLLUP_PURE_JS=true
export JS_ONLY=true
export SKIP_BINARY_INSTALL=true
export BUILD_ONLY_JS=true
export NODE_OPTIONS=--no-warnings

# Run the build with special environment variables
echo "🚀 Starting build process..."
vite build --mode development --config vite.config.js

echo "Build process completed."
