const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const amazonPaapi = require('amazon-paapi');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

app.post('/search', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required.' });
  }

  try {
    const data = await amazonPaapi.SearchItems({
      Keywords: keyword,
      PartnerTag: process.env.skoul27-21,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.in',
      AccessKey: process.env.AKPA5O46561745912142,
      SecretKey: process.env.47b9oAEAjNWCq1xOjq6Yb0V9roPjio98iB9D64/j,
      ItemCount: 10,
      Resources: ['Images.Primary.Medium', 'ItemInfo.Title', 'Offers.Listings.Price']
    });

    res.json(data.SearchResult.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong with Amazon API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
