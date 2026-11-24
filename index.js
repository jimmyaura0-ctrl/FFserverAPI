const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Guest accounts list (Apne generated guest tokens yahan dalein)
const GUEST_TOKENS = [
  // "YOUR_JWT_TOKEN_1",
  // "YOUR_JWT_TOKEN_2"
];

app.get('/', (req, res) => {
  res.json({ status: "online", message: "FF Like Server is Running!" });
});

app.get('/like', async (req, res) => {
  const { uid, region } = req.query;

  if (!uid) {
    return res.status(400).json({ success: false, message: "UID is required" });
  }

  if (GUEST_TOKENS.length === 0) {
    return res.json({
      success: true,
      message: `Test Mode: Server connected for UID ${uid} (${region || 'IND'}). Add guest tokens in index.js to send real likes.`
    });
  }

  let sentCount = 0;
  for (const token of GUEST_TOKENS) {
    try {
      // Garena Like Endpoint Call
      await axios.post(
        'https://ggblueshark.com',
        { uid: Number(uid), region: region || 'IND' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      sentCount++;
    } catch (e) {
      // Skip expired token
    }
  }

  res.json({
    success: true,
    likes_sent: sentCount,
    message: `Sent ${sentCount} likes to UID ${uid}`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
