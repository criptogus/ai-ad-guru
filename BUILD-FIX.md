
# Build Fix for Native Module Issues

This project contains several fixes for platform-specific native module dependencies that can cause build failures.

## Quick Fix

Run the following command:

```bash
bash fix-build.sh
```

This script will:
1. Apply a direct fix to the Rollup native module by replacing it with a pure JavaScript implementation
2. Set environment variables to avoid Puppeteer and other native dependencies
3. Run the build with the correct configuration

## Manual Fix

If the bash script doesn't work, you can apply the fix manually:

```bash
# Apply the direct fix to Rollup native module
node native-module-fix.js

# Then run the build with necessary environment variables
PUPPETEER_SKIP_DOWNLOAD=true ROLLUP_NATIVE=false vite build --mode development
```

## How it Works

The fix works by:
1. Replacing the native.js module with a pure JavaScript implementation that doesn't require platform-specific binaries
2. Updating import statements in related files to use the mocked module
3. Setting environment variables to skip downloads of native dependencies
4. Configuring Vite to externalize problematic dependencies

## Troubleshooting

If you still encounter issues:
- Make sure node_modules is present
- Try deleting the node_modules directory and running the fix again
- Check for any other platform-specific dependencies in package.json
