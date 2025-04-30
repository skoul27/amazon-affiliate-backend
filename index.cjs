const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const amazonPaapi = require('amazon-paapi');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/search', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required.' });
  }

  try {
    const data = await amazonPaapi.SearchItems({
      Keywords: keyword,
      PartnerTag: process.env.AMAZON_PARTNER_TAG,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.in',
      AccessKey: process.env.AWS_ACCESS_KEY_ID,
      SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
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
