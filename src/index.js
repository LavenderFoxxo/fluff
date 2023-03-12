/* Boring Modules Stuff */
require("dotenv").config();

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
});

/* Binding Stuff */

client.commandDir = "./src/commands/"
client.eventDir = "./src/events/"

/* Loading Events, Slash Commands, and More! */

require('./handlers/slash')(client);
require('./handlers/events')(client);

/* Let's get up and running! */

client.login(process.env.TOKEN);