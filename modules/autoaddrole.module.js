/**
 * Add autorole to users without any role#
 */
var autoaddroleModule = module.exports = {
    cfg: require('../config.json'),
    autoaddrole: null,
    roles: null,

    // Run
    onReadyHandler: (client) => {
        autoaddroleModule.roles = client.guilds.array()[0].roles;
        autoaddroleModule.autoaddrole = client.guilds.array()[0].roles.find(role => role.name === autoaddroleModule.cfg.AutoroleName);

        // Set roles on run
        autoaddroleModule.setRoles(client);

        // Set roles every x minutes
        let autorole_interval = setInterval( (client) => {
            autoaddroleModule.setRoles(client)
        }, autoaddroleModule.cfg.AutoroleCheckRolesIntervalMinutes * 1000 * 60, client);
    },

    setRoles: (client) => {
        let i;
        for( i in client.users.array() ){
            let User = client.users.array()[i];
            let has_role = false;

            // Search users without roles
            if( User.bot == false ) {
                let r;
                for(r in autoaddroleModule.roles.array() ) {
                    let Role = autoaddroleModule.roles.array()[r];
                    if(Role.name != '@everyone') {
                        let Rolecheck = Role.members.find(user => user.id === User.id);
                        if(Rolecheck !== null) {
                            has_role = true;
                            break;
                        }
                    }
                }
                if(!has_role && User.presence.status != 'offline') {
                    // Get member and add autorole
                    let Member = client.guilds.array()[0].members.find(member => member.id === User.id);
                    Member.addRole(autoaddroleModule.autoaddrole.id);

                    // Send msg
                    client.channels.find(channel => channel.name == autoaddroleModule.cfg.InfoChannelName).send(
                        `${User.username} ist nun seit einiger Zeit online, hat aber keine Rolle. Ich verpasse ihm mal die Rolle ${autoaddroleModule.cfg.AutoroleName}.`
                    );
                    console.log(`User ${User.username} ist online und hat keine Rolle! Fuege die Autorolle hinzu!`);
                }
            }
        }
    },

};