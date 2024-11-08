// -----------------------------------------------------------------------------------------------------
// Import required libraries
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const puppeteer = require('puppeteer');

// Constants for OAuth client
const CLIENT_ID = "78961766343-kroronmihe54uls5sf19esohiso62ri7.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = 'https://www.innomeet.com';

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate authentication URL for Google OAuth2
function generateAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  });
}

// Print the authentication URL to the console
function printAuthUrl() {
  const authUrl = generateAuthUrl();
  console.log('Visit the following URL to authenticate:', authUrl);
}

// Join Google Meet using Puppeteer
async function joinGoogleMeet(meetLink) {
  const browser = await puppeteer.launch({
    headless: false,  // Set to false to see the browser actions, true for headless
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();
  await page.goto(meetLink);

  // Wait for the "Join" button to appear and click it
  await page.waitForSelector('button[aria-label="Join now"]');
  await page.click('button[aria-label="Join now"]');

  // Optionally wait for the meeting to start
  await page.waitForTimeout(5000);

  console.log('Joined the Google Meet!');
}

// Entry point: Print authentication URL and join a Google Meet
async function main() {
  printAuthUrl();
  await joinGoogleMeet('https://meet.google.com/mnm-uytn-nia');
}

// Run the main function
main().catch(err => console.error('Error:', err));
