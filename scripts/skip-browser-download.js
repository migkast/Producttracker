// This script prevents Playwright from downloading browsers during Netlify build
if (process.env.NETLIFY) {
  process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1';
  console.log('Skipping Playwright browser download in Netlify environment');
} else {
  // Only download browser in non-Netlify environments
  require('playwright-core/lib/utils/registry').installBrowsersForNpmInstall();
}