const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
const path = require('path');

router.post('/', async (req, res) => {
  const { to, subject, message } = req.body;

  const html = `
    <p>Xin chào, đây là nội dung email:</p>
    <p><strong>${message}</strong></p>
  `;

  const success = await sendEmail({
    to,
    subject,
    htmlContent: html,
    cc: 'ccemail@example.com',
    bcc: 'bccemail@example.com',
    attachments: [
      {
        filename: 'hello.txt',
        path: path.join(__dirname, '../files/hello.txt')
      }
    ]
  });

  res.json({ success });
});

module.exports = router;
