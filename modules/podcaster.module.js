/**
 * Podcaster module
 */
var podcasterModule = module.exports = {
    cfg: require('../config.json'),
    youtube: require('youtube-channel-videos'),
    ytdl: require('ytdl-core'),
    streamOptions: { seek: 0, volume: 1 },
    videoTitle: 'Das verbotene Glocki Video :)',
    videoUrl: 'https://www.youtube.com/watch?v=ArX1PMG_hcM',
    nextVideoUrl: null,
    playFromChannelId: null,
    stream: null,
    dispatcher: null,
    connection: null,
    videos: null,

    // Run
    onReadyHandler: async (client) => {
        // Set default for playFromChannelId
        podcasterModule.playFromChannelId = podcasterModule.cfg.RadioStations[0].YouTubeChannelId;

        // Connect and play
        let radiochannel = client.channels.find(channel => channel.name === podcasterModule.cfg.RadioChannelName);
        if (radiochannel) {
            radiochannel.join().then((connection) => {
                podcasterModule.setConnection(connection);
                podcasterModule.youtube.channelVideos(podcasterModule.cfg.YouTubeApiKey, podcasterModule.playFromChannelId, (channelItems) => {
                    if (channelItems.length) {
                        podcasterModule.setVideos(channelItems);
                        podcasterModule.setRandomVideoUrl();
                        podcasterModule.play(client);
                    }
                });
            }).catch((rejected) => {
                console.log('podcasterModule: Error joining voice channel.');
                console.log(rejected);
            });
        }
    },

    // Message handler for this module
    onMessageHandler: async (msg,client) => {
        if(msg.author.bot === false && msg.content.startsWith(podcasterModule.cfg.BotMsgPrefix) ) {
            let args = msg.content.slice(podcasterModule.cfg.BotMsgPrefix.length).split(/ +/);
            if(podcasterModule[args[0]]) {
                args[0] = args[0].toLocaleLowerCase();
                podcasterModule[args[0]](msg,client,args);
            }
        }
    },

    // List radio stations
    stations: (msg,client,args) => {
        let replyMsg = '';
        msg.channel.send('Folgende Radiostationen sind verfügbar:');
        for( let i = 0; i < podcasterModule.cfg.RadioStations.length; i++) {
            let radiostationIndex = i + 1;
            replyMsg += `${radiostationIndex}: ${podcasterModule.cfg.RadioStations[i].Station}\n`;
        }
        msg.channel.send(replyMsg);
    },

    // Change radio station
    station: (msg,client,args) => {
        if(args[1]) {
            let stationIndex = args[1] - 1;
            if( podcasterModule.cfg.RadioStations[stationIndex] ) {
                podcasterModule.playFromChannelId = podcasterModule.cfg.RadioStations[stationIndex].YouTubeChannelId;
                msg.channel.send(`Ändere die Frequenz *schraub* *dreh*`);

                // Reload videos
                podcasterModule.youtube.channelVideos(podcasterModule.cfg.YouTubeApiKey, podcasterModule.playFromChannelId, (channelItems) => {
                    if (channelItems.length) {
                        podcasterModule.setVideos(channelItems);
                        msg.channel.send(`Das Radio wurde auf die Station ${podcasterModule.cfg.RadioStations[stationIndex].Station} eingestellt.`);
                    }
                });
            } else {
                msg.channel.send('Keine gültige Radiostation angegeben.');
            }
        } else {
            msg.channel.send('Keine gültige Radiostation angegeben.');
        }
    },

    // Play url as next item
    playurl: (msg,client,args) => {
        if(args[1] && args[1].includes('youtu')) {
            podcasterModule.nextVideoUrl = args[1];
            msg.channel.send(`Ich versuche <${args[1]}> als nächstes zu spielen.`);
        } else {
            msg.channel.send('Keine gültige URL zu YouTube angegeben.');
        }
    },

    // Stop stream
    skip: (msg,client,args) => {
        podcasterModule.dispatcher.end();
    },

    // Get random yt video and play audio
    play: async (client) => {
        if (podcasterModule.connection !== null) {
            if (podcasterModule.videoUrl !== null) {
                console.log(`podcasterModule: now playing as podcast: ${podcasterModule.videoUrl}`);
                podcasterModule.stream = await podcasterModule.ytdl(podcasterModule.videoUrl, {filter: 'audioonly'});
                podcasterModule.dispatcher = await podcasterModule.connection.playStream(podcasterModule.stream, podcasterModule.streamOptions);
                // Send msg
                if(podcasterModule.videoTitle === null) {
                    client.channels.find(channel => channel.name == podcasterModule.cfg.RadioTextChannelName).send(
                        `Ich spiele gerade das Audio von folgendem Video ab: <${podcasterModule.videoUrl}>`
                    );
                } else {
                    client.channels.find(channel => channel.name == podcasterModule.cfg.RadioTextChannelName).send(
                        `Ich spiele gerade das Audio des Videos *${podcasterModule.videoTitle}* ab: <${podcasterModule.videoUrl}>`
                    );
                }
                // On end play next
                podcasterModule.dispatcher.on('end', () => {
                    podcasterModule.videoUrl = null;
                    podcasterModule.setRandomVideoUrl();
                    podcasterModule.play(client);
                });
            } else {
                console.log('podcasterModule: videoUrl is null');
            }
        } else {
            console.log('podcasterModule: No voice connection');
        }
    },

    // Set connection of audio channel
    setConnection: (con) => {
        podcasterModule.connection = con;
    },

    // Set videos
    setVideos: (vids) => {
        podcasterModule.videos = vids;
    },

    // Set video url (random video of channel)
    setRandomVideoUrl: async () => {
        if(podcasterModule.nextVideoUrl === null) {
            if (podcasterModule.videos.length) {
                let r = Math.floor(Math.random() * (podcasterModule.videos.length - 0) + 0);
                if (podcasterModule.videoUrl === null) {
                    podcasterModule.videoUrl = 'https://www.youtube.com/watch?v=' + podcasterModule.videos[r].id.videoId;
                    podcasterModule.videoTitle = podcasterModule.videos[r].snippet.title;
                }
            }
        }
        else {
            podcasterModule.videoUrl = podcasterModule.nextVideoUrl;
            podcasterModule.nextVideoUrl = null;
            podcasterModule.videoTitle = null;
        }
    },

};
