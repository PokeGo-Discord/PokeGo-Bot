import Client from '../Extends/ExtendsClient'
import { Guild, TextChannel, Message, InteractionCollector, CommandInteraction, ApplicationCommand, CommandInteractionOptionResolver, InteractionType, AttachmentBuilder, EmbedBuilder } from 'discord.js'
import { isSpawnDate, isGuildActive, getPathFile } from './utils'
import { isUserExist, getUserId } from '../Database/UtilsModals/UtilsUsers'
import { message_count } from '../Events/Client/messageCreate'
import { updateGuildLastSpawnDate } from '../Database/UtilsModals/UtilsGuilds'
import { STATS_NAME, NATURE_MULTIPLIERS, NATURES, EMBED_COLOR} from './constants'
import pokemonsModal, { Pokemons } from '../Database/Modals/pokemonsModal'
import { BaseStatsType, getBaseStats, getSpecieName } from '../Api/PokemonApi'
import { getTeamUser } from '../Database/UtilsModals/UtilsTeams'
import { getBoxNotFull, getBoxsUser } from '../Database/UtilsModals/UtilsBoxs'

export const pokemon_active: Record<string, boolean> = {}

/**
 * Class Pokemon
 */
export class Pokemon {
    owner_id: string
    pokemonId: number
    name: string
    level: number
    nature: string
    ivs: Record<string, number>
    stats: Record<string, number>
    shiny: boolean

    /**
     * Init the pokemon, generate ivs / Stats / name / level and everything that needed for a pokemon
     */
    async initPokemon(
        owner_id: string = undefined,
        pokemonId: number = undefined,
        pokemonName: string = undefined, 
        level: number = undefined, 
        nature: string = undefined,
        ivs: Record<string, number> = undefined,
        shiny: boolean = undefined,
        ): Promise<void> 
    {
        if(owner_id !== undefined)
            this.owner_id = owner_id;
        else 
            this.owner_id = undefined

        if(pokemonId !== undefined)
            this.pokemonId = pokemonId;
        else
            this.pokemonId = await this.initPokemonId();

        if(pokemonName !== undefined)
            this.name = pokemonName;
        else
            this.name = await this.initName();

        if(level !== undefined)
            this.level = level;
        else
            this.level = await this.initLevel();

        console.log(this.level)

        if(nature !== undefined)
            this.nature = nature;
        else
            this.nature = await this.initNature();

        if(ivs !== undefined)
            this.ivs = ivs;
        else
            this.ivs = await this.initIvs();
        
        let baseStats: BaseStatsType= await getBaseStats(this.pokemonId) as BaseStatsType;
        this.stats = await this.updateStats(baseStats);
        
        if(shiny !== undefined)
            this.shiny = shiny;
        else
            this.shiny = await this.initShiny();
    }

    /**
     * Return a random pokemon id
     * @returns string
     */
    private async initPokemonId(): Promise<number> {
        const min = 1;
        const max = 905;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Return a pokemon name by pokedex id 
     * @returns string
     */
    private async initName(): Promise<string> {
        return await getSpecieName(this.pokemonId);
    }

    /**
     * Return the level of the pokemon with percentages chances
     * @returns number
     */
     private async initLevel(): Promise<number> {
        var d: number = Math.random();
        if(d < 0.6) // 60% chance of being here
            return Math.floor(Math.random() * (35 - 1) + 1); // entre 1 et 35
        else if (d < 0.7) // 10% chance of being here
            return Math.floor(Math.random() * (75 - 55) + 55); // entre 75 et 55
        else // 30% chance of being here
            return Math.floor(Math.random() * (55 - 35) + 35); // entre 55 et 35
    }

    /**
     * Return a random nature
     * @returns string
     */
    private async initNature(): Promise<string> {
        const keys = Object.keys(NATURES);
        const nature_name = NATURES[keys[Math.floor(Math.random() * keys.length)]];
        return nature_name;
    }

    /**
     * Determine if the pokemon is shiny or not
     * @returns boolean
     */
     private async initShiny(): Promise<boolean> {
        let chance = 1 / 4096;
        return (Math.random() < chance)
    }
    
    /**
     * Initialise ivs of the pokemon
     * @returns ivs as object
     */
    private async initIvs(): Promise<Record<string, number>> {
        let ivs: Record<string, number> = {}
        for (let i = 0; i < STATS_NAME.length; i++) ivs[STATS_NAME[i]] = Math.floor(Math.random() * (32 - 1) + 1)

        return ivs
    }

    /**
     * Update stats of the pokemon
     * @param baseStats
     * @returns stats object
     */
    async updateStats(
        baseStats: Record<string, number>
    ): Promise<Record<string, number>> {
        let stats: Record<string, number> = {}
        for (let i = 0; i < STATS_NAME.length; i++)
            stats[STATS_NAME[i]] = await this.calc_stat(baseStats, STATS_NAME[i])

        return stats
    }

    /**
     * Calcule les stats du pokemon
     * @param baseStats
     * @param key ex: 'atk'
     * @returns number
     */
    private calc_stat(baseStats: Record<string, number>, statName: string): number {
        if(statName == 'hp')
            return Math.floor(
                Math.floor((((this.ivs[statName] + 2 * baseStats[statName]) * this.level) / 100)) + this.level + 10
            )
        else
            return Math.floor(
                (Math.floor(((this.ivs[statName] + 2 * baseStats[statName]) * this.level) / 100) + 5) * NATURE_MULTIPLIERS[this.nature][statName]
            )
    }
}

/**
 * Spawn a pokemon to the guild.
 * @param guildId
 */
export async function SpawningPokemon(guild: Guild, client: Client) {

    pokemon_active[guild.id] = true;

    const pokemon = new Pokemon();
    await pokemon.initPokemon();
    console.log(pokemon.name);

    const channel: TextChannel = client.channels.cache.get("993372173269999628") as TextChannel;
    await sendEmbedPokemon(channel, pokemon.name)

    const collector = await new InteractionCollector(client, {channel: channel, interactionType: InteractionType.ApplicationCommand, guild: channel.guild, time: 15000})

    let userId = null
    let interaction = null

    collector.on("collect", async (i: CommandInteraction) => {
        if(i.commandName != 'catch' || !i.isCommand()) return
        
        const isRegistered = await isUserExist(i.user.id)
        if(!isRegistered)
            return void (i.reply({ content: 'You are not registered, please do: ``/start`` and choose a starter pokemon!', ephemeral:true}))
            
        const options = i.options as CommandInteractionOptionResolver
        const res = options.getString('pokemon');
        if(pokemon.name !== res) 
            return void (i.reply({ content: 'That is the wrong pokémon', ephemeral:true }));

        pokemon.owner_id = await getUserId(i.user.id);
        interaction = i
        userId = i.user.id;
        collector.stop('finded')
    })

    collector.on('end', async (collected, reason)  => {
        pokemon_active[guild.id] = false;
        delete pokemon_active[guild.id];

        // Reset message_count
        message_count[guild.id] = 0;
        updateGuildLastSpawnDate(guild.id);
        
        if(reason == "time") {
            channel.send('Nobody find the correct answere')
            return;
        }

        const pokemonDb = await pokemonsModal.create({
            owner_id: pokemon.owner_id,
            pokemonId: pokemon.pokemonId,
            name: pokemon.name,
            level: pokemon.level,
            nature: pokemon.nature,
            ivs: pokemon.ivs,
            stats: pokemon.stats,
            shiny: pokemon.shiny,
        })

        channel.send(interaction.user.username + ' found the correct pokemon, it was ' + pokemon.name)

        const teams = await getTeamUser(userId);
        if(teams.pokemons_id.length < 6) {
            teams.pokemons_id.push(pokemonDb.id)
            teams.save()
            return interaction.reply({ content:'That is the good pokémon, he was add to your team', ephemeral: true})
        }

        const box = await getBoxNotFull(userId)
        if(!box) // TODO: ASK FOR REPLACE A POKEMON FROM THE BOX
            return console.log("TODO: ASK for replace")
        
        interaction.reply({ content:'That is the good pokémon, he was add to your boxs', ephemeral: true})
        box.pokemons_id.push(pokemonDb.id)
        box.save()
    });

}

/**
 * Create the embed pokemon and send it
 * @param channel 
 * @param pokemonName 
 * @returns Message boolean
 */
export async function sendEmbedPokemon(channel: TextChannel, pokemonName: string): Promise<Message<boolean>> {
    const file = new AttachmentBuilder(getPathFile(pokemonName));
    const attachment_string = 'attachment://' + pokemonName + '.gif';
    const pokemonEmbed = new EmbedBuilder()
        .setColor(EMBED_COLOR)
        .setTitle('A wild pokémon has appeared!')
        .setDescription('Guess the pokémon and type ``/catch <pokemon>`` to catch it!')
        .setImage(attachment_string)

    return await channel.send({ embeds: [pokemonEmbed], files:[file] });
}

/**
 * Return true if a pokemon can spawn, or false if a pokemon can't spawn.
 * @param guildId
 * @returns boolean
 */
export async function isSpawnable(guildId: string): Promise<boolean> {
    let isActive = await isGuildActive(guildId)
    let isDate = await isSpawnDate(guildId)
    //console.log(isActive + ' ' + isDate)
    if (!isActive || !isDate ||  pokemon_active[guildId]) return false

    return true
}

