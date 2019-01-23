/**
 * Discord Bot setup
 */
const { Client } = require('discord.js');
const bot = new Client();
const cfg = require('./config.json');

/**
 * Login bot to discord server via token from cfg.token
 */
console.log('Bot logging in...');
bot.login(cfg.Token).catch(
    () => {
        console.log('Bot login error!');
    }
);
bot.on('ready', () => {
    console.log('Bot logged in!');
    bot.user.setActivity(cfg.ActivityString);
});

/**
 * Error handling
 */
bot.on('error', (err) => {
    console.log(err);
});

/**
 * Run podcaster module
 */
const podcaster = require('./modules/podcaster.module.js');
bot.on('ready', () => { podcaster.onReadyHandler(bot) });
bot.on('message', (msg) => { podcaster.onMessageHandler(msg,bot) });
