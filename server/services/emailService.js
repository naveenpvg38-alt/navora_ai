const nodemailer = require('nodemailer');

// Initialize transporter if SMTP configuration is present in environment
function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  }

  return null;
}

/**
 * Generate a beautifully formatted HTML verification email for NAVORA AI
 */
function getVerificationEmailHtml(name, otp) {
  const safeName = name ? name.trim() : 'Explorer';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NAVORA AI Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070B14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070B14; padding: 36px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background: linear-gradient(180deg, #0E1626 0%, #090E1A 100%); border-radius: 20px; border: 1px solid rgba(34, 211, 238, 0.25); box-shadow: 0 20px 50px rgba(0,0,0,0.7); overflow: hidden;" cellspacing="0" cellpadding="0">
          
          <!-- Top Cyber Cyan Scanline -->
          <tr>
            <td style="height: 3px; background: linear-gradient(90deg, #06b6d4, #22d3ee, #818cf8);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 16px 32px; text-align: center;">
              <div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); margin-bottom: 16px;">
                <span style="font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 0.12em; color: #22d3ee; text-transform: uppercase;">
                  TUMKUR OUTING INTELLIGENCE · 2FA
                </span>
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">
                NAVORA <span style="color: #22d3ee;">·</span> AI
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 12px 32px 28px 32px; text-align: left;">
              <p style="font-size: 15px; line-height: 1.6; color: #CBD5E1; margin: 0 0 16px 0;">
                Hello <strong>${safeName}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0 0 24px 0;">
                Welcome to NAVORA AI. To verify your email address and activate your explorer account, please enter the 6-digit security code below:
              </p>

              <!-- OTP Code Display Card -->
              <div style="background: #060A13; border: 1px solid rgba(34, 211, 238, 0.35); border-radius: 14px; padding: 22px 16px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #78716C; margin-bottom: 8px;">
                  YOUR 6-DIGIT VERIFICATION CODE
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 12px; color: #22d3ee; text-shadow: 0 0 16px rgba(34, 211, 238, 0.4); padding-left: 12px;">
                  ${otp}
                </div>
              </div>

              <!-- Security Information -->
              <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94A3B8;">
                  ⏱️ <strong>Valid for 10 minutes.</strong> Never share this code with anyone. NAVORA AI representatives will never ask for your verification code.
                </p>
              </div>

              <p style="font-size: 12px; line-height: 1.6; color: #64748B; margin: 0;">
                If you did not request this account creation, you can safely disregard this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background: rgba(0, 0, 0, 0.35); border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; font-family: monospace;">
                NAVORA AI · Autonomous Outing System · Tumkur District, Karnataka
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send verification OTP to user's email
 * @param {string} email
 * @param {string} name
 * @param {string} otp 6-digit numeric code
 * @returns {Promise<{ success: boolean, simulated: boolean }>}
 */
async function sendVerificationEmail(email, name, otp) {
  const transporter = createTransporter();

  // If real transporter is configured, attempt sending email
  if (transporter) {
    try {
      const fromAddress = process.env.SMTP_FROM || `"NAVORA AI" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`;
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: `Your NAVORA AI Verification Code: ${otp}`,
        text: `Hello ${name || 'Explorer'}, your verification code for NAVORA AI is: ${otp}. It expires in 10 minutes.`,
        html: getVerificationEmailHtml(name, otp)
      });

      console.log(`[EMAIL] Verification code successfully sent to ${email}`);
      return { success: true, simulated: false };
    } catch (err) {
      console.warn(`[EMAIL WARNING] SMTP send failed (${err.message}). Falling back to simulation mode.`);
    }
  }

  // Fallback: Simulation mode for local dev & testing
  console.log(`\n=============================================================`);
  console.log(`🚀 [NAVORA AI] EMAIL VERIFICATION CODE (SIMULATION / DEV MODE)`);
  console.log(`📬 To: ${name ? name + ' <' + email + '>' : email}`);
  console.log(`🔑 Verification Code: [ ${otp} ]`);
  console.log(`⏳ Expires in: 10 minutes`);
  console.log(`🛡️ Rate Limit: 60s cooldown, max 5 attempts`);
  console.log(`=============================================================\n`);

  return { success: true, simulated: true };
}

module.exports = {
  sendVerificationEmail
};
