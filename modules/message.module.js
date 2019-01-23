/**
 * Message handler module
 */
var messageModule = module.exports = {
    cfg: require('../config.json'),
    youtube: require('youtube-channel-videos'),
    fs: require('fs'),

    // Run
    onMessageHandler: async (msg, client) => {
        if(msg.author.bot === false && msg.content.startsWith(messageModule.cfg.BotMsgPrefix) ) {
            let args = msg.content.toLocaleLowerCase().slice(messageModule.cfg.BotMsgPrefix.length).split(/ +/);
            if(messageModule[args[0]]) {
                messageModule[args[0]](msg,client,args);
            }
            else {
                console.log(`messageModule: Command ${args[0]} does not exist.`);
                messageModule.help(msg,client,args);
            }
        }
    },

    help: (msg,client,args) => {
        let helpText = messageModule.fs.readFileSync(`./messages/${messageModule.cfg.HelpTextFile}`, 'utf8', (err,data)=> {
            console.log('messageModule: Error reading help file');
            console.log(err);
        });
        msg.channel.send(helpText);
    },

    last: (msg,client,args) => {
        messageModule.youtube.channelVideos(messageModule.cfg.YouTubeApiKey, messageModule.cfg.YouTubeChannelId, function(channelItems) {
            let yt_results = channelItems.length;
            if(yt_results) {
                // Sort by date
                channelItems.sort(function(a,b){ let d1 = new Date(a.snippet.publishedAt); let d2 = new Date(b.snippet.publishedAt); return d2.getTime() - d1.getTime(); });
                // Send msg to channel
                msg.channel.send(`Hier das letzte Video von Let's Shoot:`);
                msg.channel.send(`https://youtu.be/${channelItems[0].id.videoId}`);
            }
        });
    },

    random: (msg,client,args) => {
        messageModule.youtube.channelVideos(messageModule.cfg.YouTubeApiKey, messageModule.cfg.YouTubeChannelId, function(channelItems) {
            let yt_results = channelItems.length;
            if(yt_results) {
                let r = Math.floor(Math.random() * (yt_results - 0) + 0);
                msg.channel.send(`Hier ein zufälliges Video von Let's Shoot:`);
                msg.channel.send(`https://youtu.be/${channelItems[r].id.videoId}`);
            }
        });
    },

    search: (msg,client,args) => {
        let searcharray = args.slice(1).map( (s) => {
            return s.trim().toLocaleLowerCase();
        });
        let searchstring = args.slice(1).join(' und ').trim().toLocaleLowerCase();

        console.log(`messageModule: Suche Videos mit folgenden Begriffen: ${searchstring}`);
        msg.channel.send(`Suche Videos mit folgenden Begriffen: ${searchstring}...\n`);

        messageModule.youtube.channelVideos(messageModule.cfg.YouTubeApiKey, messageModule.cfg.YouTubeChannelId, function(channelItems) {
            let yt_results = channelItems.length;
            let hits = [];
            if(yt_results) {
                for(let i=0; i < yt_results; i++) {
                    let yt_title = channelItems[i].snippet.title.toLowerCase();
                    let yt_description = channelItems[i].snippet.description.toLowerCase();
                    let hitsCounter = 0;
                    for(let j=0; j < searcharray.length; j++) {
                        if(yt_title.search(searcharray[j]) != -1 || yt_description.search(searcharray[j]) != -1) {
                            hitsCounter++;
                        }
                    }
                    if(hitsCounter >= searcharray.length) {
                        hits.push(channelItems[i]);
                    }
                }
                if(hits.length > 0) {
                    let resultCount = hits.length;
                    // Limit
                    if(hits.length > 3) {
                        hits = hits.slice(0,2);
                    }
                    // Output results
                    for( let i = 0; i < hits.length; i++ ) {
                        msg.channel.send(`https://youtu.be/${hits[i].id.videoId}`);
                    }
                    if(resultCount > 3 ) {
                        msg.channel.send(`Das sind die besten 3 Ergebnisse, aber ich habe ingesamt ${resultCount} Videos gefunden.`);
                        msg.channel.send(`Schau doch mal auf YouTube direkt: https://www.youtube.com/channel/${messageModule.cfg.YouTubeChannelId}/search?query=` + searcharray.join('+'));
                    }
                    else {
                        msg.channel.send(`Das waren alle Ergebnisse. Mehr habe ich nicht gefunden.`);
                    }
                }
                else {
                    msg.channel.send(`Leider nichts gefunden... :-(`);
                }
            }
        });
    },

    // Dummy function - cmd is handled by podcasterModule
    stations: (msg,client,args) => {

    },
    // Dummy function - cmd is handled by podcasterModule
    station: (msg,client,args) => {

    },
    // Dummy function - cmd is handled by podcasterModule
    playurl: (msg,client,args) => {

    },
    // Dummy function - cmd is handled by podcasterModule
    skip: (msg,client,args) => {

    },

};