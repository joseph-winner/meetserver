const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const playwright = require('playwright'); // Import Playwright

const app = express();
const port = 5000;

// CORS configuration - Allow requests from specific frontend domain
const corsOptions = {
    origin: 'https://meet-rust-pi.vercel.app', // Your frontend domain
    methods: ['GET', 'POST'], // Allow only GET and POST methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true // Include credentials if needed
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS with the specified options
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
      console.log('Invalid request: Meet link or auth token is missing');
      return res.status(400).send('Invalid request. Meet link or auth token missing.');
    }
  
    try {
      // Initialize the OAuth client
      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials({ access_token: authToken });
  
      // Test authentication by calling Google API to verify token validity
      await oauth2Client.getAccessToken();
      console.log('OAuth token is valid');
  
      // Launch Playwright browser
      const browser = await playwright.chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',  // Helps reduce memory usage
          '--disable-gpu',
          '--no-zygote',
          '--single-process',
        ],
      });
      
      const page = await browser.newPage();
      // Now try to navigate to the Google Meet link
      await page.goto(meetLink, { waitUntil: 'networkidle' });
      console.log('Successfully navigated to Google Meet link');
  
      // Try interacting with the page (like finding the "Join now" button)
      await page.waitForSelector('button[aria-label="Join now"]', { visible: true });
      await page.click('button[aria-label="Join now"]');
      console.log('Clicked "Join now" button');
  
      // Close the browser after joining
      await browser.close();
      res.status(200).send('Successfully joined the meeting');
    } catch (error) {
      console.error('Error joining Google Meet:', error.message || error); // Detailed error logging
      res.status(500).send('Failed to join the meeting due to an error.');
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
