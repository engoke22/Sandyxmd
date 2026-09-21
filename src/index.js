import { Bot } from "grammy";

export default {
  async fetch(request, env) {
    const bot = new Bot(env.BOT_TOKEN);

    if (request.method === "GET") {
      return new Response("UNIQUE 001 is online.", {
        status: 200,
        headers: {
          "content-type": "text/plain;charset=UTF-8"
        }
      });
    }

    if (request.method === "POST") {
      try {
        const update = await request.json();
        await bot.handleUpdate(update);

        return new Response("OK", { status: 200 });
      } catch (error) {
        console.error("Telegram update error:", error);

        return new Response("Webhook error", {
          status: 500
        });
      }
    }

    return new Response("Method Not Allowed", {
      status: 405
    });
  }
};
