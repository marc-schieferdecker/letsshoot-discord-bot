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
 * Run autotrash module
 */
const autotrash = require('./modules/autotrash.module.js');
bot.on('ready', () => { autotrash.onReadyHandler(bot) });
