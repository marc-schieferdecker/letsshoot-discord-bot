/**
 * Set tipeee roles to users (loaded from google spreadsheet)
 */
const { GoogleSpreadsheet } = require('google-spreadsheet');

var tipeeeModule = module.exports = {
    cfg: require('../config.json'),
    sheetapi: null,
    roles: null,

    // Run
    onReadyHandler: async (client) => {
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
        // Load sheet
        tipeeeModule.sheetapi = new GoogleSpreadsheet(tipeeeModule.cfg.TipeeeDataSheetId);
        await tipeeeModule.sheetapi.useServiceAccountAuth({
            client_email: tipeeeModule.cfg.GoogleClientCredentials.credentials.client_email,
            private_key: tipeeeModule.cfg.GoogleClientCredentials.credentials.private_key
        });
        await tipeeeModule.sheetapi.loadInfo();
        let sheet = tipeeeModule.sheetapi.sheetsByIndex[0];
        let rows = await sheet.getRows();
        console.log(`tipeeeModule: Tipperdata loaded from sheet. ${rows.length} rows found.`);

        // Check and apply roles
        for(i = 0; i < rows.length; i++) {
            let discord_username = rows[i].DiscordUsername;
            let discord_discriminator = rows[i].DiscordDiscriminator;
            let tipper_role = rows[i].DiscordRole;
            if (discord_username !== '') {
                // If the user has a tipeee role, check role and add if missing
                if(tipper_role !== '') {
                    for (n in client.users.array()) {
                        let User = client.users.array()[n];
                        if (User.username === discord_username && User.discriminator === discord_discriminator) {
                            let TipperRole = tipeeeModule.roles.find(r => r.name === tipper_role);
                            // Give user the tipeee role if he is not already a member
                            if (TipperRole !== null) {
                                if (TipperRole.members.find(member => member.id === User.id) === null) {
                                    let Member = client.guilds.array()[0].members.find(member => member.id === User.id);
                                    Member.addRole(TipperRole.id).catch(console.error);
                                    client.channels.find(channel => channel.name === tipeeeModule.cfg.InfoChannelName).send(User.username + ' ist Unterstützer und nun der Rolle ' + TipperRole.name + ' zugewiesen! Danke!');
                                    console.log(`tipeeeModule Add Roles: ${User.username} ist nun ${TipperRole.name}`);
                                } else {
                                    console.log(`tipeeeModule Add Roles: ${User.username} ist bereits ${TipperRole.name}`);
                                }
                            }
                            // Check if user has other tipper roles, if so remove them
                            tipeeeModule.cfg.TipeeeRoles.forEach((role, rkey) => {
                                if(role !== tipper_role) {
                                    let TipperRole = tipeeeModule.roles.find(r => r.name === role);
                                    if (TipperRole !== null) {
                                        if (TipperRole.members.find(member => member.id === User.id) !== null) {
                                            let Member = client.guilds.array()[0].members.find(member => member.id === User.id);
                                            console.log(`tipeeeModule Add Roles: ${User.username} hat eine andere Rolle und die Rolle ${TipperRole.name} wurde entfernt`);
                                            Member.removeRole(TipperRole.id).catch(console.error);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
                // If the user has no tipeee role, check role and remove if the user is no more a tipper
                else {
                    for (n in client.users.array()) {
                        let User = client.users.array()[n];
                        if (User.username === discord_username && User.discriminator === discord_discriminator) {
                            console.log(`tipeeeModule Remove Roles: ${User.username} hat Discord Angaben, aber keine Rolle`);
                            // Check roles of user against tipeee roles from config
                            tipeeeModule.cfg.TipeeeRoles.forEach((role, rkey) => {
                                let TipperRole = tipeeeModule.roles.find(r => r.name === role);
                                if (TipperRole !== null) {
                                    if (TipperRole.members.find(member => member.id === User.id) !== null) {
                                        let Member = client.guilds.array()[0].members.find(member => member.id === User.id);
                                        console.log(`tipeeeModule Remove Roles: ${User.username} hat die Rolle ${TipperRole.name} nun nicht mehr`);
                                        Member.removeRole(TipperRole.id).catch(console.error);
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    },
};
