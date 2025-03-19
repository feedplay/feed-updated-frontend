import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

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
        user: 'feedplayui@gmail.com',
        pass: 'feedplayui2025'
      }
    });

    const mailOptions = {
      from: 'feedplayui@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", otp);
    res.status(200).json({ otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
