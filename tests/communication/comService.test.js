/* eslint-disable no-undef */
const communicationService = require('../../src/services/communicationService');
const emailTransporter = require('../../src/config/emailConfig');
const smsClient = require('../../src/config/smsConfig');

jest.mock('../../src/config/emailConfig');
jest.mock('../../src/config/smsConfig', () => ({
  messages: {
    create: jest.fn().mockResolvedValue(true),
  },
}));

describe('Communication Service', () => {
  describe('sendEmailOtp', () => {
    const email = 'test@example.com';
    const otp = '123456';

    it('should send an email OTP successfully', async () => {
      emailTransporter.sendMail.mockResolvedValue(true);

      const result = await communicationService.sendEmailOtp(email, otp);

      expect(emailTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });
      expect(result).toBe(true);
    });

    it('should throw an error when sending email fails', async () => {
      emailTransporter.sendMail.mockRejectedValue(new Error('SMTP error'));

      await expect(communicationService.sendEmailOtp(email, otp)).rejects.toThrow('Failed to send OTP via email');
      expect(emailTransporter.sendMail).toHaveBeenCalled();
    });
  });

  describe('sendSmsOtp', () => {
    const mobile = '+1234567890';
    const otp = '654321';

    it('should send an SMS OTP successfully', async () => {
      smsClient.messages.create.mockResolvedValue(true);

      const result = await communicationService.sendSmsOtp(mobile, otp);

      expect(smsClient.messages.create).toHaveBeenCalledWith({
        body: `Your OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: mobile,
      });
      expect(result).toBe(true);
    });

    it('should throw an error when sending SMS fails', async () => {
      smsClient.messages.create.mockRejectedValue(new Error('Twilio error'));

      await expect(communicationService.sendSmsOtp(mobile, otp)).rejects.toThrow('Failed to send OTP via SMS');
      expect(smsClient.messages.create).toHaveBeenCalled();
    });
  });
});
