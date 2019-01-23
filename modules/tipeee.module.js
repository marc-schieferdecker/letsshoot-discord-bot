/**
 * Set tipeee roles to users (loaded from google spreadsheet)
 */
var tipeeeModule = module.exports = {
    cfg: require('../config.json'),
    tipeeesheet: null,
    roles: null,

    // Run
    onReadyHandler: async (client) => {
        // Connect sheet
        tipeeeModule.tipeeesheet = require('google-spreadsheets-to-2d-array')(tipeeeModule.cfg.GoogleClientCredentials);
        // Set roles from client
        tipeeeModule.roles = client.guilds.array()[0].roles;

        // Set roles on run
        tipeeeModule.setRoles(client);

        // Set roles every x minutes
        let tipeeeroles_interval = setInterval((client) => {
            tipeeeModule.setRoles(client);
        }, tipeeeModule.cfg.TipeeeCheckRolesIntervalMinutes * 1000 * 60, client);
    },

    setRoles: async (client) => {
        tipeeeModule.tipeeesheet.load(tipeeeModule.cfg.TipeeeDataSheetId).then(function (r) {
            let tipperdata = r.sheet(0);
            console.log('tipeeeModule: Tipperdata loaded from sheet.');
            for (i = 1; i < tipperdata.data.length; i++) {
                let discord_username = tipperdata.get(i, 0);
                let discord_discriminator = tipperdata.get(i, 1);
                let tipper_role = tipperdata.get(i, 2);
                if (discord_username != '') {
                    for (n in client.users.array()) {
                        let User = client.users.array()[n];
                        if (User.username == discord_username && User.discriminator == discord_discriminator) {
                            let TipperRole = tipeeeModule.roles.find(role => role.name === tipper_role);
                            if (TipperRole !== null) {
                                if (TipperRole.members.find(member => member.id === User.id) === null) {
                                    let Member = client.guilds.array()[0].members.find(member => member.id === User.id);
                                    Member.addRole(TipperRole.id);
                                    client.channels.find(channel => channel.name === tipeeeModule.cfg.InfoChannelName).send(User.username + ' ist Unterstützer und nun der Rolle ' + TipperRole.name + ' zugewiesen! Danke!');
                                    console.log('tipeeeModule: User ' + User.username + ' ist nun ' + TipperRole.name);
                                } else {
                                    console.log('tipeeeModule: User ' + User.username + ' ist bereits ' + TipperRole.name);
                                }
                            }
                        }
                    }
                }
            }
        }).catch(
            (err) => {
                console.log('tipeeeModule: Error on reading Tipeee spreadsheet.');
                console.log(err);
            }
        );
    },

};
