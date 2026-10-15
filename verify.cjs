const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: {
      dir: 'videos/'
    }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/');

  // Wait for the main elements to load
  await page.waitForSelector('.home-screen');

  // Wait a bit to let the page settle
  await page.waitForTimeout(3000);

  // Ensure the footer is visible and the QR code specifically
  const qrCodeLocator = page.locator('.footer-qr-code');
  await qrCodeLocator.scrollIntoViewIfNeeded();

  // Highlight the QR code for visibility
  await qrCodeLocator.evaluate((node) => {
    node.style.border = '5px solid red';
  });

  // Take a screenshot of the footer containing the QR code
  await page.screenshot({ path: 'screenshot.png' });

  // Wait a little longer to record the highlighted state
  await page.waitForTimeout(2000);

  await context.close();
  await browser.close();
  console.log("Verification script finished");
})();
