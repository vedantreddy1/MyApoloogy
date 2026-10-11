# Apology Website — Vercel + Telegram Notifications

A mobile-friendly apology page with an animated envelope, playful button, honest choices, and Telegram notifications. Plain HTML/CSS/JS with a Vercel serverless endpoint.

## 1. Get a Telegram bot token

1. Open Telegram, search for the verified **@BotFather** bot, and send `/newbot`.
2. Follow the instructions and copy the **bot token**. **Keep it secret.**
3. Find the bot you just created and send it `/start` from your own Telegram account.
4. In a browser, open `https://api.telegram.org/botYOUR_TOKEN/getUpdates` (replace `YOUR_TOKEN` locally). Find `message.chat.id` in the JSON. This is your **chat ID**. If `result` is empty, send your bot another message and reload the URL.
5. If you accidentally share your token, revoke it with BotFather and generate a new one.

## 2. Deploy on Vercel

1. Upload **the contents of this folder** to a GitHub repository. `index.html` and the `api` directory must be at the repository root, or select this folder as the Vercel root directory.
2. In Vercel choose **Add New → Project**, import the GitHub repository, select **Framework Preset: Other**.
3. Leave the **Build Command** unset. Keep Output Directory at the default/blank. Do not use `public` as output directory.
4. In **Environment Variables**, add:
   - `TELEGRAM_BOT_TOKEN` → the BotFather token.
   - `TELEGRAM_CHAT_ID` → the numeric chat ID from `getUpdates`.
   - `SITE_ORIGIN` → optional extra protection, e.g. `https://your-site.vercel.app` (no trailing slash; if used, set it to the *exact* URL visitors use).
5. Click **Deploy**. After adding or changing variables later, redeploy so they're active.
6. Test your production URL on mobile. Make a selection. You should receive one Telegram message with the choice.

> Notifications are sent **only after the visitor chooses an option**. Closing the note sends nothing. Each explicit option (Yes, Not yet, I need some space) is eligible to send a message. The page discloses this before the selection. There is no analytics, browser fingerprinting, identity collection, or tracking.

## 3. Customize

- Edit the apology wording in `index.html` at `id="dialogDescription"`.
- Edit the thank-you/space messages inside `showResult` in `script.js`.
- Edit the Telegram text in `api/response.js`.

## 4. Local testing

Double-click `index.html` to preview layout and animations. The notification feature **will not work from a file:// page**. For local notification testing, install Vercel CLI and run `vercel dev` with environment variables configured; otherwise test using your Vercel deployment.

## Troubleshooting

- No Telegram message? Make sure you pressed **Start** on your bot and that the chat ID is from the correct account.
- A response says it couldn't be delivered? Check Vercel **Logs** and that the environment variables are set for the deployment environment.
- With `SITE_ORIGIN` enabled, accessing another preview/custom-domain URL will be blocked until you update this value. You can leave `SITE_ORIGIN` unset.

**Respect the recipient's choice.** The Not yet button moves playfully twice, then becomes selectable, and the clear “I need some space” option is always present. Do not repeatedly share the page if she has asked for no contact.
