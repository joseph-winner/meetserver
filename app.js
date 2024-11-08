const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const { google } = require('googleapis');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Google OAuth 2.0 credentials
const CLIENT_ID = "78961766343-kroronmihe54uls5sf19esohiso62ri7.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = 'https://www.innomeet.com';

// Helper function to get OAuth2 client
function getOAuth2Client() {
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

// Route to handle OAuth token exchange and automate Google Meet joining
app.post('/join-meet', async (req, res) => {
  const { meetLink, authToken } = req.body;
  if (!meetLink || !authToken) {
    return res.status(400).send('Invalid request. Meet link or auth token missing.');
  }

  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: authToken });

    // Use the OAuth2 client to access Google Meet
    const meetService = google.meet({ version: 'v1', auth: oauth2Client });

    // Initialize Puppeteer to automate joining the meeting
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Go to the Google Meet link
    await page.goto(meetLink, { waitUntil: 'networkidle2' });

    // Wait for the "Join now" button to appear and click it
    await page.waitForSelector('button[aria-label="Join now"]', { visible: true });
    await page.click('button[aria-label="Join now"]');

    // Wait for meeting page to load
    await page.waitForSelector('.meet-view', { visible: true });

    console.log('Successfully joined the meeting!');
    await browser.close();
    res.status(200).send('Successfully joined the meeting');
  } catch (error) {
    console.error('Error joining Google Meet:', error);
    res.status(500).send('Failed to join the meeting due to an error.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
