import nodemailer from "nodemailer"
import config from "../../../config";

const emailSender = async (email:string,html:string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email,
      pass: config.APP_PASS,
      },
      tls: {
          rejectUnauthorized: false
      }
  });

  // Wrap in an async IIFE so we can use await.
    const info = await transporter.sendMail({
      from: '"PH Healt hCare" <musaakramsaleh18@gmail.com>',
      to: email,
      subject: "Reset Password Link",
    //   text: "Hello world?", // plain‑text body
      html, // HTML body
    });
}

export default emailSender