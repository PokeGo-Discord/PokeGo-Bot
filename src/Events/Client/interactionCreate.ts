import { CommandInteraction, MessageEmbed } from 'discord.js'
import Client from '../../Extends/ExtendsClient'

export default {
    name: 'interactionCreate',
    once: false,

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute(interaction: CommandInteraction, client: Client) {

        if(!interaction.isApplicationCommand()) return;

        const command = client.commands.get(interaction.commandName)

        if(!command) return interaction.reply({embeds: [
            new MessageEmbed()
            .setColor("RED")
            .setDescription("❌ An error occured while running this command.")
        ]}) && client.commands.delete(interaction.commandName) && client.application.commands.delete(interaction.commandName);

        command.execute(interaction, client)
        
    },
}
