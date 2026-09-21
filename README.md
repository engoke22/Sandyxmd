# UNIQUE 001

A Telegram group/community bot built with grammY and Cloudflare Workers.

## Features

- Main menu, status, ping, profile and Telegram ID
- Welcome/goodbye messages
- Group message statistics
- Recent-user tracking with Cloudflare KV
- Rules system
- Warning system with automatic ban after 3 warnings
- Kick, ban, mute and unmute
- Promote/demote
- `/all` mention helper
- Telegram polls
- Weather lookup
- Cryptocurrency lookup
- Quote, joke and trivia
- Demo-only `/predict` and `/signal`
- Cloudflare Workers webhook endpoint
- Cloudflare KV persistence

## 1. Create the Telegram bot

Create a bot using BotFather and copy its token.

## 2. Install

```bash
npm install
```

## 3. Login to Cloudflare

```bash
npx wrangler login
```

## 4. Create KV

```bash
npx wrangler kv namespace create BOT_KV
```

Copy the returned namespace ID into `wrangler.toml`.
For production you can omit `preview_id` if you do not use local preview KV.

## 5. Configure secrets

```bash
npx wrangler secret put BOT_TOKEN
npx wrangler secret put BOT_OWNER_ID
```

Optional weather:

```bash
npx wrangler secret put OPENWEATHER_API_KEY
```

## 6. Deploy

```bash
npm run deploy
```

Cloudflare will give you a Worker URL such as:

`https://unique-001.<your-subdomain>.workers.dev`

## 7. Set the Telegram webhook

Replace `YOUR_BOT_TOKEN` and `YOUR_WORKER_URL`:

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://YOUR_WORKER_URL"}'
```

Check it:

```bash
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```

## 8. Test

Open your Telegram bot and send:

```text
/start
/menu
/status
/ping
/help
```

For groups, add the bot and give it the Telegram administrator permissions required for moderation commands.

## Security

Never commit `BOT_TOKEN`, owner IDs treated as secrets in your environment, or API keys to GitHub. Store them as Cloudflare Worker secrets.

The `/predict` and `/signal` commands in this project are demonstration-only random values. They do not predict or guarantee outcomes of real gambling games.
