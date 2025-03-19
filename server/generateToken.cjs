const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin with service account
const serviceAccount = require('./proud-parity-452805-k3-8e81753e9924.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://feedback-ui-da9bf.firebaseio.com"
});

app.post('/generate-token', async (req, res) => {
  const { email } = req.body;

  try {
    const uid = email.replace(/[.@]/g, '_'); // Create a valid UID from email
    const customToken = await admin.auth().createCustomToken(uid);
    res.status(200).json({ token: customToken });
  } catch (error) {
    console.error("Error generating custom token:", error);
    res.status(500).json({ error: 'Failed to generate custom token' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
