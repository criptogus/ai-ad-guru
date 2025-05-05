
# Build Fix Guide

This repository contains several scripts to fix build issues related to Rollup, Puppeteer, and Supabase types.

## Quick Fix

Run the following command:

```bash
bash fix-build.sh
```

This script will:
1. Create mock files for Rollup native modules
2. Set up mock Puppeteer executables
3. Run the build with appropriate environment variables

## Alternative Fix Methods

If the bash script doesn't work, try:

```bash
node fix-build-all.js
```

Or:

```bash
node generate-supabase-types.js
```

## Manual Steps

If automatic fixes don't work:

1. Create a mock for Rollup's native.js:
   ```js
   // node_modules/rollup/dist/native.js
   export async function parseAsync() {
     return { type: 'Program', body: [], sourceType: 'module' };
   }
   export function xxhashBase64Url() { return 'mockHash'; }
   export function xxhashBase36() { return 'mockHash'; }
   export function xxhashBase16() { return 'mockHash'; }
   export default { parseAsync, xxhashBase64Url, xxhashBase36, xxhashBase16 };
   ```

2. Run the build with special environment variables:
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true ROLLUP_NATIVE=false vite build --mode development
   ```

## TypeScript Errors

If you encounter TypeScript errors related to missing types:

- Check the generated `src/integrations/supabase/types.d.ts` file
- Make sure tables like `ad_spend_fees`, `company_info`, and updated `profiles` fields are defined
