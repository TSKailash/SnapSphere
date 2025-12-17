import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000, // 5s
  greetingTimeout: 5000,
  socketTimeout: 5000,
});


console.log("EMAIL_HOST =", process.env.SMTP_HOST);
console.log("EMAIL_PORT =", process.env.SMTP_PORT);

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP ERROR:", err);
  } else {
    console.log("✅ Brevo SMTP Ready");
  }
});


const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Kailash" <tskailash20@gmail.com>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is: ${otp}`,
    });
  } catch (err) {
    console.error("❌ SENDMAIL ERROR (REAL):", err);
    throw err; // VERY IMPORTANT
  }
};


export {sendOTP}