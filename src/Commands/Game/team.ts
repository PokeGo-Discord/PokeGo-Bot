import { AttachmentBuilder, CommandInteraction } from 'discord.js'
import { Command } from '../../Typings/Command'
import Client from '../../Extends/ExtendsClient'
import { isUserExist } from '../../Database/UtilsModals/UtilsUsers'
import { createEmbedNoRegisted, getPathFile } from '../../Helpers/utils'
import { getTeamUser } from '../../Database/UtilsModals/UtilsTeams'
import Canvas from '@napi-rs/canvas';
import { readFileSync } from 'fs'
import { getAllPathTeams, getPokemonNameByMongoId, loadPokemonImg } from '../../Database/UtilsModals/UtilsPokemons'



export default {
    data: {
        name: "team",
        type: 1,
        description: "Show your team",
        options: []
    },
    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction: CommandInteraction, client: Client) {
        if(await !isUserExist(interaction.user.id)) return interaction.reply({embeds: [createEmbedNoRegisted()], ephemeral: true});

        const teams = await getTeamUser(interaction.user.id)

        const canvas = Canvas.createCanvas(400, 245);
		const context = canvas.getContext('2d');
        
        const backgroundPath = process.cwd().replace(/\\/g, '/') + '/src/Templates/team_template.jpg'
        const background = await Canvas.loadImage(readFileSync(backgroundPath));

        // This uses the canvas dimensions to stretch the image onto the entire canvas
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#0099ff';

        context.strokeRect(0, 0, canvas.width, canvas.height);

        // Use the helpful Attachment class structure to process the file for you

        const pokemonFiles = await getAllPathTeams(teams.pokemons_id)
        
        const loadedPokemonImg = await loadPokemonImg(pokemonFiles, Canvas)
    
        let x = 150
        loadedPokemonImg.forEach(img => {
            context.drawImage(img, x, 40, 50, 50)
            x += 80
        });

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'team.png' });

        interaction.reply({ files: [attachment] });
    }
} as Command