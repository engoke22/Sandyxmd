import { webhookCallback } from "grammy";
import { bot } from "./bot.js";

const handleUpdate = webhookCallback(bot, "cloudflare-mod");

export default {
  async fetch(request, env, ctx) {
    try {
      // Health check
      if (request.method === "GET") {
        return new Response("UNIQUE 001 is ONLINE", {
          status: 200,
          headers: {
            "Content-Type": "text/plain"
          }
        });
      }

      // Telegram webhook
      if (request.method === "POST") {
        return await handleUpdate(request);
      }

      return new Response("Method Not Allowed", {
        status: 405
      });

    } catch (error) {
      console.error("UNIQUE 001 ERROR:", error);

      return new Response("Internal Server Error", {
        status: 500
      });
    }
  }
};
