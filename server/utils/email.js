const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Goddess Aradhya Sanctum" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verification Required - Sacred Access Code',
    html: `
      <div style="background-color: #0a0a0a; color: #ffffff; padding: 40px; font-family: 'Playfair Display', serif; border: 1px solid #7f1d1d;">
        <h1 style="color: #ef4444; border-bottom: 1px solid #450a0a; padding-bottom: 10px;">The Sanctum Awaits</h1>
        <p style="font-size: 16px; line-height: 1.6;">Devotee,</p>
        <p style="font-size: 16px; line-height: 1.6;">You have requested entry to the dominion of Goddess Aradhya. Your identity must be verified through this sacred access code:</p>
        <div style="background-color: #1a1a1a; padding: 20px; text-align: center; margin: 30px 0; border: 1px dashed #ef4444;">
          <span style="font-size: 32px; letter-spacing: 10px; color: #ef4444; font-weight: bold;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #525252; italic;">This code is valid for only 10 minutes. Do not share it, or face permanent blacklisting.</p>
        <div style="margin-top: 40px; border-top: 1px solid #450a0a; padding-top: 20px; text-align: center;">
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #7f1d1d;">Obedience • Sacrifice • Silence</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email Transmission Failed:', error);
    return false;
  }
};

const sendBookingStatusEmail = async (email, userName, status, city, date) => {
  const transporter = createTransporter();
  const isApproved = status === 'approved';
  
  const subject = isApproved 
    ? 'DECREE: Your Petition has been Granted' 
    : 'NOTICE: Petition for Audience Denied';

  const htmlContent = isApproved ? `
    <div style="background-color: #0a0a0a; color: #ffffff; padding: 40px; font-family: 'serif'; border: 2px solid #7f1d1d; max-width: 600px; margin: auto;">
      <h1 style="color: #ef4444; text-align: center; text-transform: uppercase; letter-spacing: 5px;">Decree of Acceptance</h1>
      <div style="height: 1px; background: linear-gradient(to right, transparent, #7f1d1d, transparent); margin: 20px 0;"></div>
      <p style="font-size: 18px; line-height: 1.6; font-style: italic; color: #d1d5db;">"${userName},"</p>
      <p style="font-size: 16px; line-height: 1.8; color: #9ca3af;">
        Your petition for an audience has been reviewed by the High Priestess. We have found a flicker of potential in your submission. 
      </p>
      <div style="background-color: #1a1a1a; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ef4444;">
        <p style="margin: 0; color: #ef4444; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Sanctum Details</p>
        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 20px;">Location: <strong>${city}</strong></p>
        <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 20px;">Protocol Date: <strong>${date}</strong></p>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">
        Prepare yourself. Discretion is absolute. Further instructions regarding the ritual site and financial tribute will be delivered via secure channel 24 hours prior to the appointment. 
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #ef4444; font-weight: bold; margin-top: 20px;">
        Do not be late. Do not be unworthy.
      </p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #450a0a; text-align: center;">
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #450a0a;">Dominion of Goddess Aradhya</p>
      </div>
    </div>
  ` : `
    <div style="background-color: #0a0a0a; color: #ffffff; padding: 40px; font-family: 'serif'; border: 2px solid #262626; max-width: 600px; margin: auto;">
      <h1 style="color: #404040; text-align: center; text-transform: uppercase; letter-spacing: 5px;">Dismissal of Presence</h1>
      <div style="height: 1px; background: #262626; margin: 20px 0;"></div>
      <p style="font-size: 16px; line-height: 1.8; color: #737373;">
        Your petition has been discarded. After reviewing your records and your message, the Goddess finds your current state of devotion insufficient for an audience.
      </p>
      <div style="margin: 30px 0; padding: 20px; border: 1px solid #262626; text-align: center;">
        <p style="margin: 0; color: #525252; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Petition Status</p>
        <p style="margin: 5px 0 0 0; color: #7f1d1d; font-size: 18px; font-weight: bold; text-transform: uppercase;">Rejected</p>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: #404040; font-style: italic;">
        Do not appeal this decision. Silence is the only response required of you now.
      </p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #262626; text-align: center;">
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 4px; color: #262626;">Dominion closed to you</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"Goddess Aradhya Sanctum" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Status Email Transmission Failed:', error);
    return false;
  }
};

module.exports = { sendOTPEmail, sendBookingStatusEmail };