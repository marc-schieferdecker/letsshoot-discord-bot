Let's Shoot Discord Bot
=======================

The Let's Shoot Discord Bot is a simple discord bot with some neat functions. The bot is very useful for YouTube creators with a Discord server.

* YouTube channel integration for one YouTube channel (config.json)
    * Users can request a random video of that channel
    * Users can search for videos in that channel
    * Users can request the last video posted on that channel
* Play audio from a YouTube Video in a voice channel
    * You can define different channels as "radio station" (config.json)
    * Users can switch between stations
    * Users can skip active audio streams
    * Users can submit a YouTube video url to play audio of that video
* Auto add discord role (config.json)
    * After every X minutes the bot automatically adds a role to users without any role (to permanent their account)
* Tipeee integration (config.json)
    * You can setup a Google spreadsheet in which you save your Tipeee supporters
    * The bot reads that sheet and gives the defined role to the defined user

Installation
============

You will need node, npm, ffmpeg (+ development and compiler packages) to get the bot running.

I run the bot on an Ubuntu 18.04 LTS and I don't know how to run it with Windows so don't ask but tell me if you find out. :)

1) Download zip package and extract to local machine or server
2) Install ffmpeg and development packages
3) run "npm i" to install and compile node packages (if you get errors development or compiler packages are missing)
4) Create "config.json" to configure the bot (use "config.example.json" as template)
    * Set Discord Token for your bot (create one here https://discordapp.com/developers/applications/)
    * Set Tipeee data sheet id (create Google spreadsheet, share it read only and copy the id from the url)
    * Head to console.cloud.google.com, create project, activate YouTube API v3 and create a service account. Copy the json credentials to the config.json.
    * In this Google project also create a YouTube API key and set the key in config
    * Set the YouTube channel id for your YouTube channel
    * Edit config as you need to (auto role name etc)
4) start.sh (starts all 3 bot processes, use "node bot.messages.app.js" to start just one part of the bot)

Config
=====

This is the config file template. Edit and save the "config.example.json" to "config.json" before you start the bot.

```json
{
    "Token": "",
    "BotMsgPrefix": "!ls ",
    "TipeeeCheckRolesIntervalMinutes": 60,
    "TipeeeDataSheetId": "",
    "GoogleClientCredentials": {
        "credentials": {
            "type": "service_account",
            "project_id": "",
            "private_key_id": "",
            "private_key": "",
            "client_email": "",
            "client_id": "",
            "auth_uri": "",
            "token_uri": "",
            "auth_provider_x509_cert_url": "",
            "client_x509_cert_url": ""
        }
    },
    "YouTubeApiKey": "",
    "YouTubeChannelId": "UCCBM5_mz3e1SWlbe8MD9boQ",
    "ActivityString": "!ls help",
    "AutoroleName": "Aktiv",
    "AutoroleCheckRolesIntervalMinutes": 5,
    "InfoChannelName": "news",
    "RadioChannelName": "radio",
    "RadioTextChannelName": "radiochat",
    "RadioStations": [
        {"Station": "Let's Shoot", "YouTubeChannelId": "UCCBM5_mz3e1SWlbe8MD9boQ"},
        {"Station": "Gordons Reloading Channel", "YouTubeChannelId": "UCEdG4IMYRhSA4Tc09hUKN_A"},
        {"Station": "Deutsche Schützen", "YouTubeChannelId": "UCkFrX74o3eaepd0idHXx6Rw"},
        {"Station": "wiederladerTv", "YouTubeChannelId": "UCw02LOPGRYM7QiVnfJuOrvA"},
        {"Station": "Lassen Sie Es Krachen", "YouTubeChannelId": "UCNj_cyh0wyUB5eieMIBRVjQ"},
        {"Station": "AirGhandi", "YouTubeChannelId": "UCBbx3ygdWygo6qeGJBPvjaQ"},
        {"Station": "Frankonia (Team Winz)", "YouTubeChannelId": "UC_FJtflzpwwh7RD1vwHa-hQ"},
        {"Station": "ePIG Group", "YouTubeChannelId": "UCuS6wbED-BeCrkonNTwT9zQ"},
        {"Station": "Bulletonic", "YouTubeChannelId": "UCg44h9TsFidf6pS2yB44E2Q"},
        {"Station": "Karabinercafé", "YouTubeChannelId": "UCEgYe5vyMY3TrWG42weHKOA"},
        {"Station": "impfunk", "YouTubeChannelId": "UCi_Y8rdLSLufgcPseYe0JSg"},
        {"Station": "ben.spricht.podcast", "YouTubeChannelId": "UC8dmRE28q0LSPKQMFqJYS7w"}
    ],
    "HelpTextFile": "help.msg"
}
```

If you have feature requests, suggestions or bug reports please open an issue here on github.

To see the bot in action just join my Discord: http://discord.letsshootshow.de
