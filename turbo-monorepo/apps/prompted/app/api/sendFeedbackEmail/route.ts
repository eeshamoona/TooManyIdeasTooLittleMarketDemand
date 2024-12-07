import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { userEmail, message } = await req.json();

    if (!userEmail || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com", // Use your SMTP provider's host (e.g., Zoho, Gmail, etc.)
      port: 465, // For secure connections
      secure: true, // Use TLS
      auth: {
        user: "support@writeprompted.com", // Your email address
        pass: process.env.EMAIL_PASSWORD, // Password or app-specific password
      },
    });

    // Set up email data
    const mailOptions = {
      from: "support@writeprompted.com",
      to: "support@writeprompted.com", // Receiver's email
      subject: `Feedback from ${userEmail}`, // Email subject
      text: message + "\n\n Sent from:" + userEmail, // Email body
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
