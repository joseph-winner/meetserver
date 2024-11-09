const express = require('express');
const app = express();
const port = 5000;
const puppeteer = require('puppeteer');

async function testPuppeteer() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    console.log('Successfully opened Google');
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

testPuppeteer();


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  