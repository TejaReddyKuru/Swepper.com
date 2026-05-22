const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, '');

let transporter = null;
let isTransporterReady = false;

if (!emailUser || !emailPass) {
  console.warn(
    '⚠️  Missing SMTP credentials (EMAIL_USER/EMAIL_PASS) in backend/.env. SWEEPER.CO will log OTPs to the console instead of sending real emails.'
  );
} else {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.warn(
        '⚠️  SMTP transporter verification failed. We will fall back to logging OTPs to the console:\n',
        error.message
      );
    } else {
      isTransporterReady = true;
      console.log('✅ SMTP transporter is ready to send messages');
    }
  });
}

const sendOTPEmail = async (email, otp) => {
  if (isTransporterReady && transporter) {
    try {
      const mailOptions = {
        from: `"SWEEPER.CO" <${emailUser}>`,
        to: email,
        subject: 'SWEEPER.CO - Verify Your Email (OTP)',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 28px; font-weight: 800; color: #059669; letter-spacing: -0.5px;">SWEEPER<span style="color: #0f172a;">.CO</span></span>
            </div>
            <h2 style="color: #0f172a; text-align: center; font-size: 22px; margin-bottom: 16px; font-weight: 700;">Verify Your Email Address</h2>
            <p style="font-size: 16px; color: #475569; line-height: 1.6; text-align: center; margin-bottom: 30px;">
              Thank you for signing up with SWEEPER.CO! To complete your registration and secure your account, please enter the 6-digit One-Time Password (OTP) below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; padding: 16px 32px; background-color: #ecfdf5; border-radius: 12px; border: 2px dashed #a7f3d0; display: inline-block;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #64748b; line-height: 1.6; text-align: center; margin-bottom: 30px;">
              This verification code is valid for <strong>5 minutes</strong>.<br />
              If you did not initiate this request, please secure your credentials or contact support.
            </p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
              SWEEPER.CO &bull; Local Home Cleaning Subscription Startup<br />
              Feel the magic of a spotless home.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return;
    } catch (err) {
      console.warn('⚠️  Failed to send SMTP email, falling back to console log:', err.message);
    }
  }

  // Fallback behavior: log OTP to console in development
  console.log('\n✉️  ==================================================');
  console.log(`✉️  SWEEPER.CO EMAIL SIMULATION`);
  console.log(`✉️  To:      ${email}`);
  console.log(`✉️  Subject: SWEEPER.CO - Verify Your Email (OTP)`);
  console.log(`✉️  OTP:     ${otp}`);
  console.log('✉️  ==================================================\n');
};

module.exports = { sendOTPEmail };
