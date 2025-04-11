
import { NextResponse } from "next/server";
import { Resend } from "resend";


const createWelcomeEmailTemplate = (firstName, lastName, email) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Career Clutch!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" width="100%" style="max-width: 600px; margin: 20px auto; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
          <tr>
            <td style="background-color: #4b6cb7; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Career Clutch!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="color: #333333; font-size: 16px; margin: 0 0 15px;">Dear ${firstName} ${lastName},</p>
              <p style="color: #333333; font-size: 16px; margin: 0 0 15px;">
                Congratulations! Your Career Clutch account has been successfully created with the email: <strong>${email}</strong>.
              </p>
              <p style="color: #333333; font-size: 16px; margin: 0 0 15px;">
                We're thrilled to have you on board. Start exploring job opportunities, upload your portfolio, or connect with professionals today!
              </p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://careerclutch.vercel.app/" style="display: inline-block; padding: 12px 24px; background-color: #4b6cb7; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
                  Go to Your Profile
                </a>
              </p>
              <p style="color: #333333; font-size: 16px; margin: 0 0 15px;">
                If you have any questions, our support team is here to help at <a href="mailto:support@careerclutch.com" style="color: #4b6cb7; text-decoration: none;">d.vamsitej333@gmail.com</a>
              </p>
              <p style="color: #333333; font-size: 16px; margin: 0;">Best regards,<br>The Career Clutch Team</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center;">
              <p style="color: #777777; font-size: 12px; margin: 0;">
                © 2025 Career Clutch. All rights reserved.<br>
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

export async function POST(req) {
  try {
    const { firstName, lastName, email } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send welcome email
    await resend.emails.send({
      from: "Career Clutch <no-reply@vamsitejchowdary.com>", // Replace with your verified Resend domain
      to: email,
      subject: "Welcome to Career Clutch - Your Account is Ready!",
      html: createWelcomeEmailTemplate(firstName, lastName, email),
    });

    return NextResponse.json({ message: "Welcome email sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json({ message: "Failed to send welcome email." }, { status: 500 });
  }
}