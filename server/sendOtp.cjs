const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'feedplayui@gmail.com', // Replace with your email
        pass: 'jmnh qkok odzo cayp' // Replace with your app password
      }
    });

    const mailOptions = {
      from: 'feedplayui@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", otp);
    console.log("Email sent info:", info);
    res.status(200).json({ otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
