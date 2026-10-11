'use strict';

// Vercel Node.js serverless function; credentials exist only on the server.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expectedOrigin = process.env.SITE_ORIGIN;
  if (expectedOrigin) {
    const origin = req.headers.origin;
    if (origin !== expectedOrigin.replace(/\/$/, '')) {
      return res.status(403).json({ error: 'Invalid origin' });
    }
  }

  const { choice } = req.body || {};
  const choices = {
    yes: '❤️ Yes, I accept the apology',
    not_yet: '🌸 Not yet',
    space: '🌿 I need some space'
  };
  if (!Object.prototype.hasOwnProperty.call(choices, choice)) {
    return res.status(400).json({ error: 'Invalid selection' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(503).json({ error: 'Notifications have not been configured' });
  }

  const message = `💌 Apology page response\n\n${choices[choice]}\n\nSent after the visitor made their selection.`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let upstream;
    try {
      upstream = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!upstream.ok) {
      console.error('Telegram notification failed:', upstream.status);
      return res.status(502).json({ error: 'Could not deliver the notification' });
    }
    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error('Notification connection error:', error.message);
    return res.status(502).json({ error: 'Could not deliver the notification' });
  }
};
