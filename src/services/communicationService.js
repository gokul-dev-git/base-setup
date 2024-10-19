const emailTransporter = require('../config/emailConfig');
const smsClient = require('../config/smsConfig');

const sendEmailOtp = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await emailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error('Failed to send OTP via email');
  }
};

const sendSmsOtp = async (mobile, otp) => {
  try {
    await smsClient.messages.create({
      body: `Your OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile,
    });
    return true;
  } catch (error) {
    throw new Error('Failed to send OTP via SMS');
  }
};

module.exports = {
  sendEmailOtp,
  sendSmsOtp,
};
