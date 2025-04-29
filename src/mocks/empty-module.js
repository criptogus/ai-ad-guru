
// Mock module for Rollup native and Puppeteer
export function parse() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export async function parseAsync() {
  return { type: 'Program', body: [], sourceType: 'module' };
}

export default {
  isSupported: false,
  getDefaultExports() {
    return { parse, parseAsync };
  }
};
