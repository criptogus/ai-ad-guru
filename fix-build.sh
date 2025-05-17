
#!/bin/bash

# Fix Rollup native module issue and build the project
echo "🔧 Starting build fix process..."

# Apply Rollup native module fix
node native-module-fix.js

# Set environment variables to skip problematic dependencies
export ROLLUP_NATIVE_SKIP=true
export ROLLUP_PURE_JS=true
export PUPPETEER_SKIP_DOWNLOAD=true
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_SKIP_VALIDATE_CHROMIUM_INSTALLATION=true
export BROWSER=none

# Run the build with modified environment
echo "🚀 Starting build with environmental fixes..."
vite build --mode development

echo "✅ Build process completed!"
