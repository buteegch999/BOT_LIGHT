require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const mineflayer = require('mineflayer');

// Discord bot setup
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.content === '!status') {
    message.channel.send(`AFK bot is running.`);
  }
  if (message.content === '!start') {
    startMinecraftBot();
    message.channel.send('Starting AFK bot...');
  }
});

client.login(process.env.DISCORD_TOKEN);

// Minecraft AFK bot
let mcBot;
function startMinecraftBot() {
  if (mcBot) {
    console.log('AFK bot already running');
    return;
  }

  mcBot = mineflayer.createBot({
    host: process.env.MC_HOST,
    port: parseInt(process.env.MC_PORT),
    username: process.env.MC_USERNAME,
    password: process.env.MC_PASSWORD || undefined,
    version: process.env.MC_VERSION
  });

  mcBot.on('login', () => {
    console.log('AFK bot logged in!');
    // Run /register and /login
    mcBot.chat(`/register ${process.env.MC_PASSWORD}`);
    mcBot.chat(`/login ${process.env.MC_PASSWORD}`);
  });

  mcBot.on('end', () => {
    console.log('AFK bot disconnected. Reconnecting in 10s...');
    mcBot = null;
    setTimeout(startMinecraftBot, 10000);
  });

  mcBot.on('error', err => {
    console.error('AFK bot error:', err);
  });
}

// Auto-start Minecraft bot on startup
startMinecraftBot();
