const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const { google } = require('googleapis');
const cors = require('cors'); // Import cors package

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
    const { authToken } = req.body;
    if (!authToken) {
      console.log('Invalid request: auth token is missing');
      return res.status(400).send('Invalid request. Auth token missing.');
    }
  
    try {
      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials({ access_token: authToken });
  
      // Test the token by calling a simple Google API
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
      const userInfo = await oauth2.userinfo.get();
      console.log('User Info:', userInfo.data); // This should log user information if the token is valid
  
      res.status(200).send('OAuth token is valid and user info retrieved successfully.');
    } catch (error) {
      console.error('OAuth error:', error.message, error.stack);
      res.status(500).send('Failed to verify the token.');
    }
  });
  
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
