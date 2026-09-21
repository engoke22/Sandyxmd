import { createBot } from "./bot.js";

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response(
        "UNIQUE 001 is online.\nUse POST /webhook for Telegram updates.",
        { status: 200, headers: { "content-type": "text/plain;charset=UTF-8" } }
      );
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (!env.BOT_TOKEN) {
      return new Response("BOT_TOKEN is not configured.", { status: 500 });
    }

    const bot = createBot(env);
    return bot.handleUpdate(await request.json());
  }
};