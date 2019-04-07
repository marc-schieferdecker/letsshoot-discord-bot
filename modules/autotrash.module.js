/**
 * Use Bluebird as promise lib
 */
var Promise = require("bluebird");

/**
 * Automatically remove messages from channels older then X minutes
 */
var autotrashModule = module.exports = {
    cfg: require('../config.json'),

    // Run
    onReadyHandler: (client) => {
        // Run check trash on startup
        autotrashModule.checkAutotrash(client);

        // check trash every 5 minutes
        let autorole_interval = setInterval( (client) => {
            autotrashModule.checkAutotrash(client)
        }, 1 * 1000 * 60, client);
    },

    checkAutotrash: (client) => {
        console.log('Running auto trash...');
        let timestampBorder = Date.now() - autotrashModule.cfg.AutoTrashTimeBorderMinutes * 60 * 1000;
        // Check all channels defined in config
        new Promise( (resolveTrash,rejectTrash) => {
            for (let i = 0; i < autotrashModule.cfg.AutoTrashChannels.length; i++) {
                new Promise( (resolveMessages,rejectMessages) => {
                    let channel = client.channels.find(channel => channel.name === autotrashModule.cfg.AutoTrashChannels[i]);
                    if (channel && channel.type == 'text') {
                        channel.fetchMessages({limit: 100}).then(messages => {
                            new Promise( (resolveDeletion,rejectDeletion) => {
                                messages.forEach((msg, index) => {
                                    new Promise( (resolveDel,rejectDel) => {
                                        if (msg.createdTimestamp < timestampBorder) {
                                            if (msg.deletable) {
                                                msg.delete()
                                                    .then(
                                                        resolveDel(msg)
                                                    )
                                                    .catch((err) => {
                                                        console.error(err);
                                                        rejectDel(msg);
                                                    });
                                            }
                                            else {
                                                rejectDel(msg);
                                            }
                                        }
                                    }).then((msg)=>{
                                        console.log('deleted message older than', timestampBorder, msg.content);
                                    }).catch( (msg) => {
                                        console.error('message not deletable', msg.content);
                                    });
                                });
                                resolveDeletion();
                            }).then(()=>{
                                console.log('message deletion finished with success');
                                resolveMessages(channel);
                            }).catch( () => {
                                console.error('message deletion finished with errors');
                                rejectMessages(channel);
                            });
                        }).catch((err) => {
                            console.error(err);
                            rejectMessages(channel);
                        });
                    }
                }).then((c)=>{
                    console.log(`message parsing of ${c.name} finished with success`);
                    resolveTrash();
                }).catch((c)=> {
                    console.log(`message parsing of ${c.name} finished with errors`);
                    rejectTrash();
                });
            }
        }).then(()=>{
            console.log('autotrash proccess finished with success');
        }).catch(()=>{
            console.error('autotrash proccess finished with errors');
        });
    }
};