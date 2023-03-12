const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = async (client) => {
    const commands = {};
    fs.readdirSync(client.commandDir).forEach((dirs) => {
        commands[dirs] = fs.readdirSync(`${client.commandDir}${dirs}`)
            .filter((file) => file.endsWith(".js"))
            .map((file) => require(`${process.cwd()}/src/commands/${dirs}/${file}`))
    });

    client.commands = commands;

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    (async () => {
        try {
            console.log("Trying to refresh slash commands.");

            await rest.put(Routes.applicationCommands(process.env.BOTID), {
                body: Object.values(commands)
                    .flat()
                    .map((command) => command.data.toJSON()),
            });

            console.log("Successfully refreshed slash commands!");
        } catch (err) {
            console.log(err);
        }
    })();
}