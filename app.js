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
  
      // Initialize Puppeteer
      const browser = await puppeteer.launch({
        headless: true, // run in headless mode for better compatibility in cloud environments
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
  
      // Temporarily navigate to a simple URL to confirm Puppeteer is working
      await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
      console.log('Successfully opened Google in Puppeteer'); // Logging successful navigation to Google
  
      // Now try to navigate to the Google Meet link
      await page.goto(meetLink, { waitUntil: 'networkidle2' });
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
  