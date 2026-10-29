// Developer utility: export only the public CV synthesis, never the private source PDF.
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto((process.env.PORTFOLIO_URL || 'http://127.0.0.1:18767') + '/percorso.html');
  await page.waitForLoadState('networkidle');
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: path.resolve(__dirname, '../assets/cv/ares-bortolussi-cv.pdf'),
    format: 'A4', margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
    printBackground: false, displayHeaderFooter: false
  });
  await browser.close();
  console.log('Exported public CV synthesis');
})().catch(error => { console.error(error); process.exit(1); });
