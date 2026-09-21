import { Bot } from "grammy";

const VERSION = "v1.0.0";
const BOT_NAME = "UNIQUE 001";
const OWNER_NAME = "UNIQUE ENGOKE LESLEY";

function nowNairobi() {
  const d = new Date();
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    timeZone: "Africa/Nairobi"
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, timeZone: "Africa/Nairobi"
  });
  return `${date}, ${time}`;
}

function buildMenu(ctx, isOwner) {
  const name = ctx.from?.first_name || "there";
  return `
╔═══[ ஜ۩ 𝗨𝗡𝗜𝗤𝗨𝗘 𝟬𝟬𝟭 ۩ஜ ]═══╗
║
║ ➽ 𝗡𝗔𝗠𝗘      : ${BOT_NAME}
║ ➽ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘   : 🟢 ONLINE
║ ➽ 𝗩𝗘𝗥𝗦𝗜𝗢𝗡    : ${VERSION}
║ ➽ 𝗢𝗪𝗡𝗘𝗥      : ${OWNER_NAME}
║ ➽ 𝗣𝗜𝗡𝗚       : 🟢 ONLINE
║ ➽ 𝗗𝗔𝗧𝗘       : ${nowNairobi()}
║
╚════════ஜ۩۩ஜ════════╝

╭───────────────╮
     𝗪𝗘𝗟𝗖𝗢𝗠𝗘
╰───────────────╯

𝗪𝗲𝗹𝗰𝗼𝗺𝗲, ${name}!
${isOwner ? "𝗢𝗪𝗡𝗘𝗥 𝗔𝗖𝗖𝗘𝗦𝗦: 🟢 𝗩𝗘𝗥𝗜𝗙𝗜𝗘𝗗\n" : ""}

╔═══[ ۩ 𝗠𝗔𝗜𝗡 ۩ ]═══╗
║
║ ➽ /menu — Main menu
║ ➽ /help — Help
║ ➽ /status — System status
║ ➽ /profile — Your profile
║ ➽ /id — Show your Telegram ID
║ ➽ /ping — Test response speed
║
╚════════════════════╝

╔═══[ ۩ 𝗖𝗢𝗠𝗠𝗨𝗡𝗜𝗧𝗬 ۩ ]═══╗
║
║ ➽ /rules — View rules
║ ➽ /setrules — Set rules
║ ➽ /stats — Group statistics
║ ➽ /all <text> — Mention recent users
║ ➽ /poll — Create a poll
║
╚══════════════════════╝

╔═══[ ۩ 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗜𝗢𝗡 ۩ ]═══╗
║
║ ➽ /kick — Remove member
║ ➽ /ban — Ban member
║ ➽ /mute — Mute member
║ ➽ /unmute — Unmute member
║ ➽ /warn — Warning system
║ ➽ /promote — Promote member
║ ➽ /demote — Demote member
║
╚══════════════════════╝

╔═══[ ۩ 𝗨𝗧𝗜𝗟𝗜𝗧𝗜𝗘𝗦 ۩ ]═══╗
║
║ ➽ /weather <city>
║ ➽ /quote
║ ➽ /joke
║ ➽ /trivia
║ ➽ /crypto <coin>
║
╚════════════════════╝

╔═══[ ۩ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ۩ ]═══╗
║ ${OWNER_NAME}
╚══════════════════════╝
`;
}

function targetUser(ctx) {
  return ctx.message?.reply_to_message?.from ?? null;
}

async function isAdmin(ctx, env) {
  if (!ctx.from || !ctx.chat) return false;
  if (String(ctx.from.id) === String(env.BOT_OWNER_ID)) return true;
  try {
    const member = await ctx.getChatMember(ctx.from.id);
    return ["administrator", "creator"].includes(member.status);
  } catch {
    return false;
  }
}

async function kvIncr(env, key) {
  if (!env.BOT_KV) return 0;
  const current = Number(await env.BOT_KV.get(key) || 0);
  const next = current + 1;
  await env.BOT_KV.put(key, String(next));
  return next;
}

async function safeReply(ctx, text, options) {
  try { return await ctx.reply(text, options); }
  catch (e) { return ctx.reply(`Error: ${e.message}`); }
}

export function createBot(env) {
  const bot = new Bot(env.BOT_TOKEN);

  bot.catch((err) => console.error("UNIQUE 001 error:", err.error));

  // Message analytics + recent-user tracking.
  bot.on("message", async (ctx, next) => {
    if (ctx.chat?.type !== "private" && env.BOT_KV) {
      await kvIncr(env, `stats:${ctx.chat.id}:messages`);
      if (ctx.from) {
        await env.BOT_KV.put(`user:${ctx.from.id}:last_seen`, new Date().toISOString());
        const key = `recent:${ctx.chat.id}`;
        const ids = new Set(JSON.parse(await env.BOT_KV.get(key) || "[]"));
        ids.add(ctx.from.id);
        await env.BOT_KV.put(key, JSON.stringify([...ids].slice(-200)));
      }
    }
    await next();
  });

  bot.command(["start", "menu"], async (ctx) => {
    const owner = String(ctx.from.id) === String(env.BOT_OWNER_ID);
    await safeReply(ctx, buildMenu(ctx, owner));
  });

  bot.command("help", async (ctx) => safeReply(ctx, `
╔═══[ ۩ 𝗨𝗡𝗜𝗤𝗨𝗘 𝟬𝟬𝟭 𝗛𝗘𝗟𝗣 ۩ ]═══╗

/menu /start
/status /ping
/profile /id
/rules /stats /poll
/weather <city>
/quote /joke /trivia
/crypto <coin>

/kick /ban /mute /unmute
/warn /promote /demote
/setrules <text>
/all <text>

Use /menu for the complete command list.

╚════════════════════════════╝
`));

  bot.command("ping", async (ctx) => {
    const t = Date.now();
    await ctx.reply("Checking UNIQUE 001...");
    await ctx.reply(`🟢 UNIQUE 001 ONLINE\nResponse: ${Date.now() - t} ms`);
  });

  bot.command("status", async (ctx) => {
    const t = Date.now();
    try {
      await ctx.api.getMe();
      await safeReply(ctx, `
╔═══[ ۩ 𝗦𝗬𝗦𝗧𝗘𝗠 ۩ ]═══╗
║
║ ➽ NAME     : ${BOT_NAME}
║ ➽ STATUS   : 🟢 ONLINE
║ ➽ VERSION  : ${VERSION}
║ ➽ PING     : ${Date.now() - t} ms
║ ➽ RUNTIME  : CLOUDFLARE WORKERS
║ ➽ TIME     : ${nowNairobi()}
║
╚══════════════════════╝`);
    } catch (e) {
      await safeReply(ctx, `🔴 Status check failed: ${e.message}`);
    }
  });

  bot.command("id", async (ctx) => {
    await safeReply(ctx,
      `𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠 𝗜𝗗\n\nUser ID: ${ctx.from?.id}\nChat ID: ${ctx.chat?.id}`
    );
  });

  bot.command("profile", async (ctx) => {
    const u = ctx.from;
    await safeReply(ctx, `
╔═══[ ۩ 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ۩ ]═══╗

➽ Name: ${u?.first_name || ""}${u?.last_name ? " " + u.last_name : ""}
➽ Username: ${u?.username ? "@" + u.username : "Not set"}
➽ ID: ${u?.id}
➽ Language: ${u?.language_code || "Unknown"}

╚════════════════════╝`);
  });

  bot.command("rules", async (ctx) => {
    const rules = await env.BOT_KV?.get(`rules:${ctx.chat.id}`);
    await safeReply(ctx, rules
      ? `╔═══[ ۩ 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦 ۩ ]═══╗\n\n${rules}\n\n╚══════════════════════╝`
      : "No rules have been configured. An admin can use /setrules <text>."
    );
  });

  bot.command("setrules", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const rules = ctx.match?.trim();
    if (!rules) return safeReply(ctx, "Usage: /setrules <text>");
    await env.BOT_KV?.put(`rules:${ctx.chat.id}`, rules);
    await safeReply(ctx, "🟢 Group rules updated.");
  });

  bot.command("stats", async (ctx) => {
    if (ctx.chat.type === "private") return safeReply(ctx, "Stats are available in groups.");
    const total = await env.BOT_KV?.get(`stats:${ctx.chat.id}:messages`) || "0";
    const recent = JSON.parse(await env.BOT_KV?.get(`recent:${ctx.chat.id}`) || "[]");
    await safeReply(ctx, `
╔═══[ ۩ 𝗚𝗥𝗢𝗨𝗣 𝗦𝗧𝗔𝗧𝗦 ۩ ]═══╗

➽ Messages tracked: ${total}
➽ Recent users: ${recent.length}
➽ Bot: ${BOT_NAME}

╚══════════════════════╝`);
  });

  bot.command("poll", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const raw = ctx.match?.trim();
    if (!raw) return safeReply(ctx, "Usage: /poll Question | Option 1 | Option 2");
    const parts = raw.split("|").map(x => x.trim()).filter(Boolean);
    if (parts.length < 3) return safeReply(ctx, "Use: /poll Question | Option 1 | Option 2");
    const [question, ...options] = parts;
    if (options.length < 2 || options.length > 10) return safeReply(ctx, "Provide 2–10 options.");
    await ctx.api.sendPoll(ctx.chat.id, question, options, { is_anonymous: false });
  });

  bot.command("warn", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const user = targetUser(ctx);
    if (!user) return safeReply(ctx, "Reply to the member you want to warn.");
    const key = `warn:${ctx.chat.id}:${user.id}`;
    const count = Number(await env.BOT_KV?.get(key) || 0) + 1;
    await env.BOT_KV?.put(key, String(count));
    await safeReply(ctx, `${user.first_name} has been warned (${count}/3).`);
    if (count >= 3) {
      try {
        await ctx.banChatMember(user.id);
        await env.BOT_KV?.delete(key);
        await safeReply(ctx, `${user.first_name} was auto-banned after 3 warnings.`);
      } catch {}
    }
  });

  bot.command("kick", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const user = targetUser(ctx);
    if (!user) return safeReply(ctx, "Reply to the member you want to kick.");
    try {
      await ctx.banChatMember(user.id);
      await ctx.unbanChatMember(user.id);
      await safeReply(ctx, `${user.first_name} was removed.`);
    } catch (e) { await safeReply(ctx, `Couldn't kick: ${e.message}`); }
  });

  bot.command("ban", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const user = targetUser(ctx);
    if (!user) return safeReply(ctx, "Reply to the member you want to ban.");
    try {
      await ctx.banChatMember(user.id);
      await safeReply(ctx, `${user.first_name} was banned.`);
    } catch (e) { await safeReply(ctx, `Couldn't ban: ${e.message}`); }
  });

  bot.command("mute", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const user = targetUser(ctx);
    if (!user) return safeReply(ctx, "Reply to the member you want to mute.");
    const minutes = Math.min(Math.max(Number(ctx.match) || 60, 1), 10080);
    try {
      await ctx.restrictChatMember(user.id, { can_send_messages: false }, {
        until_date: Math.floor(Date.now() / 1000) + minutes * 60
      });
      await safeReply(ctx, `${user.first_name} muted for ${minutes} minutes.`);
    } catch (e) { await safeReply(ctx, `Couldn't mute: ${e.message}`); }
  });

  bot.command("unmute", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const user = targetUser(ctx);
    if (!user) return safeReply(ctx, "Reply to the member you want to unmute.");
    try {
      await ctx.restrictChatMember(user.id, {
        can_send_messages: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_send_audios: true,
        can_send_documents: true,
        can_send_photos: true,
        can_send_videos: true,
        can_send_video_notes: true,
        can_send_voice_notes: true,
        can_send_polls: true,
        can_change_info: false,
        can_invite_users: true,
        can_pin_messages: false
      });
      await safeReply(ctx, `${user.first_name} unmuted.`);
    } catch (e) { await safeReply(ctx, `Couldn't unmute: ${e.message}`); }
  });

  bot.command("promote", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const user = targetUser(ctx);
    if (!user) return safeReply(ctx, "Reply to the member you want to promote.");
    try {
      await ctx.promoteChatMember(user.id, {
        can_manage_chat: true, can_delete_messages: true,
        can_restrict_members: true, can_invite_users: true
      });
      await safeReply(ctx, `${user.first_name} is now an admin.`);
    } catch (e) { await safeReply(ctx, `Couldn't promote: ${e.message}`); }
  });

  bot.command("demote", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const user = targetUser(ctx);
    if (!user) return safeReply(ctx, "Reply to the member you want to demote.");
    try {
      await ctx.promoteChatMember(user.id, {
        can_manage_chat: false, can_delete_messages: false,
        can_restrict_members: false, can_invite_users: false
      });
      await safeReply(ctx, `${user.first_name} is no longer an admin.`);
    } catch (e) { await safeReply(ctx, `Couldn't demote: ${e.message}`); }
  });

  bot.command("all", async (ctx) => {
    if (!(await isAdmin(ctx, env))) return safeReply(ctx, "Admins only.");
    const text = ctx.match?.trim() || "Attention everyone!";
    const ids = JSON.parse(await env.BOT_KV?.get(`recent:${ctx.chat.id}`) || "[]");
    const admins = await ctx.getChatAdministrators().catch(() => []);
    const seen = new Set();
    const mentions = [];
    for (const a of admins) {
      if (!a.user.is_bot && !seen.has(a.user.id)) {
        seen.add(a.user.id);
        mentions.push(`[${a.user.first_name}](tg://user?id=${a.user.id})`);
      }
    }
    for (const id of ids) {
      if (!seen.has(id)) {
        seen.add(id);
        mentions.push(`[member](tg://user?id=${id})`);
      }
    }
    for (let i = 0; i < mentions.length; i += 30) {
      await safeReply(ctx, `${text}\n\n${mentions.slice(i, i + 30).join(" ")}`, { parse_mode: "Markdown" });
    }
  });

  // Informational/demo utilities.
  bot.command("weather", async (ctx) => {
    const city = ctx.match?.trim();
    if (!city) return safeReply(ctx, "Usage: /weather Nairobi");
    const key = env.OPENWEATHER_API_KEY;
    if (!key) return safeReply(ctx, "Weather API is not configured. Add OPENWEATHER_API_KEY as a secret.");
    try {
      const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`);
      if (!r.ok) throw new Error(`Weather API ${r.status}`);
      const d = await r.json();
      await safeReply(ctx, `Weather for ${d.name}\n\nTemperature: ${d.main.temp}°C\nFeels like: ${d.main.feels_like}°C\nCondition: ${d.weather?.[0]?.description || "Unknown"}\nHumidity: ${d.main.humidity}%`);
    } catch (e) { await safeReply(ctx, `Weather failed: ${e.message}`); }
  });

  bot.command("crypto", async (ctx) => {
    const coin = (ctx.match?.trim() || "bitcoin").toLowerCase();
    try {
      const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=usd,kes`);
      if (!r.ok) throw new Error(`Crypto API ${r.status}`);
      const d = await r.json();
      if (!d[coin]) return safeReply(ctx, `Coin "${coin}" was not found.`);
      await safeReply(ctx, `Crypto: ${coin}\n\nUSD: $${d[coin].usd}\nKES: KSh ${d[coin].kes}`);
    } catch (e) { await safeReply(ctx, `Crypto lookup failed: ${e.message}`); }
  });

  bot.command("quote", async (ctx) => safeReply(ctx, "Keep building. Small releases become big systems."));
  bot.command("joke", async (ctx) => safeReply(ctx, "Why did the developer deploy on Friday? The bug wanted a weekend too."));
  bot.command("trivia", async (ctx) => safeReply(ctx, "Trivia: Cloudflare Workers run JavaScript at Cloudflare's edge."));

  // Safe demo-only signal commands. They do not predict real game outcomes.
  bot.command("predict", async (ctx) => {
    const value = (Math.random() * 4.5 + 1.2).toFixed(2);
    await safeReply(ctx, `UNIQUE 001 DEMO SIGNAL\n\nSample value: ${value}x\n\nThis is randomly generated and is NOT a prediction or guarantee of a real Aviator outcome.`);
  });

  bot.command("signal", async (ctx) => {
    const value = (Math.random() * 4.5 + 1.2).toFixed(2);
    await safeReply(ctx, `UNIQUE 001 DEMO SIGNAL\n\nSample signal: ${value}x\n\nRandom demonstration only — it cannot determine or guarantee a real game's result.`);
  });

  // Welcome / goodbye.
  bot.on("message:new_chat_members", async (ctx) => {
    for (const member of ctx.message.new_chat_members) {
      if (!member.is_bot) await safeReply(ctx,
        `Welcome, ${member.first_name}!\n\nType /menu to explore UNIQUE 001.`,
        { reply_to_message_id: ctx.message.message_id }
      );
    }
  });

  bot.on("message:left_chat_member", async (ctx) => {
    const member = ctx.message.left_chat_member;
    if (!member.is_bot) await safeReply(ctx, `${member.first_name} has left the group.`);
  });

  return bot;
}
