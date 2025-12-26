import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Send OTP for password reset
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 */
export const sendOtp  = async (email, otp) => {
    const subject = "Reset Your Password - Pawnshop System";

    const htmlMessage = `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Use the code below to reset it. This code expires in 10 minutes.</p>
        <h1 style="letter-spacing: 8px;">${otp}</h1>
        <p>Do not share this code with anyone.</p>
    `;

    const plainTextMessage = `
        PASSWORD RESET REQUEST

        We received a request to reset your password. Use the code below to reset it. This code expires in 10 minutes.

        OTP: ${otp}

        Do not share this code with anyone.
    `;

    await transporter.sendMail({
        from: `"Pawnshop System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: plainTextMessage,
        html: htmlMessage
    });
};
