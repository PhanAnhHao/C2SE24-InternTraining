const nodemailer = require('nodemailer');
const path = require('path');

const sendEmail = async ({
  to,
  subject,
  htmlContent,
  cc,
  bcc,
  attachments
}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Smart System" <${process.env.EMAIL_USER}>`,
      to,
      cc,
      bcc,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #007bff;">📩 ${subject}</h2>
          <div>${htmlContent}</div>
          <hr/>
          <p style="font-size: 12px; color: #888;">Email được gửi từ hệ thống Smart. Vui lòng không phản hồi.</p>
        </div>
      `,
      attachments: attachments || []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Email failed:', error);
    return false;
  }
};

module.exports = sendEmail;
