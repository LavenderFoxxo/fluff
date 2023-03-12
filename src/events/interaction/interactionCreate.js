const { EmbedBuilder } = require("discord.js");
const actions = require('../../handlers/actions')

module.exports = {
    name: "interactionCreate",
    /**
     * @param {import("discord.js").Interaction} interaction
     * @param {import("discord.js").Client} client
     */
    async execute (interaction, client) {
        const blacklisted = await actions.checkBlacklist(interaction.guild.id || 0)

        if (
            interaction.guild &&
            blacklisted
        ) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            "Sorry, this server is blacklisted from the bot. If the owner would like to appeal, join the support server."
                        )
                        .setColor("#FF0000"),
                ],
                ephemeral: true,
            });
        } else {
            if (interaction.isCommand()) {
                return Object.values(client.commands)
                    .flat()
                    .find((cmd) => cmd.command === interaction.commandName)
                    .run(client, interaction);
            }
        }
    },
};
