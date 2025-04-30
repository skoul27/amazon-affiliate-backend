const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const amazonPaapi = require('amazon-paapi');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Delay function to throttle API requests
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Search endpoint
app.post('/search', async (req, res) => {
  const { keyword } = req.body;

  // Check if keyword is provided
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required.' });
  }

  try {
    // Delay to avoid hitting rate limits
    await delay(1000); // Wait 1 second between requests

    // Make API call to Amazon PAAPI
    const data = await amazonPaapi.SearchItems({
      Keywords: keyword,
      PartnerTag: process.env.AMAZON_PARTNER_TAG,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.in',
      AccessKey: process.env.AWS_ACCESS_KEY_ID,
      SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      ItemCount: 10, // Limit to first 10 items
      Resources: ['Images.Primary.Medium', 'ItemInfo.Title', 'Offers.Listings.Price']
    });

    // Check if the response contains valid results
    if (data && data.SearchResult && data.SearchResult.Items) {
      // Return only the first 10 items
      res.json(data.SearchResult.Items.slice(0, 10));
    } else {
      res.status(404).json({ error: 'No products found for the given keyword.' });
    }

  } catch (err) {
    // Handle 429 error (too many requests)
    if (err.message.includes('429')) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong with Amazon API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
