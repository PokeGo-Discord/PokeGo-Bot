import { Client, Guild } from "discord.js";
import guildsModal, { Guilds } from "../Modals/guildsModal";

/**
 * Check if a guild exist by the guild ID
 * @param guildId 
 * @returns returns a boolean as promise
 */
export const isGuildExist = async (guildId: string): Promise<boolean> => {
    const guildData = await guildsModal.findOne({ guildId });

    if(guildData == null) 
        return false;

    return true;
};

/**
 * Create a guild by the guild ID
 * @param guildId 
 */
export const createGuildData = async (guildId: string): Promise<void> => {
    const guildData = 
        await guildsModal.create({
            guildId: guildId,
            spawnRemaining: Date.now(),
    });
    guildData.save();
};

/**
 * Delete a guild by the guild ID
 * @param guildId 
 */
export const deleteGuildData = async (guildId: string): Promise<void> => {
    const guildData = await guildsModal.findOne({ guildId });

    if(!guildData) return

    guildData.deleteOne()
}

/**
 * Return all data of a guild by the guild ID
 * @param guildId 
 * @returns returns a Guilds as promise
 */
export const getGuildData = async (guildId: string): Promise<Guilds> => {
    const guildData = await guildsModal.findOne({ guildId });
    return guildData;
};

/**
 * Return the remaining spawn time by the guild ID
 * @param guildId 
 * @returns return a Date as promise
 */
export const getGuildSpawnRemaining = async (guildId: string): Promise<Date> => {
    const guildData = await guildsModal.findOne({ guildId });
    return guildData.spawnRemaining
}

/**
 * Create all document for each guild that have been added when the bot was offline
 * @param guildId 
 */
export const createGuildDataOfflined = async (client: Client): Promise<void> => {
    const guildsClient: Array<string> = client.guilds.cache.map(guild => guild.id);
    const guildsMongo: Array<string> = await (await guildsModal.find({})).map(guild => guild.guildId);

    let inc: number = 0
    guildsClient.forEach(id => {
        if(guildsMongo.includes(id))
            return;
        else {
            createGuildData(id);
            inc++
            console.log(inc + " ✅ new guilds which have been added when the bot was offline, updating database...");
        }
    });
}

/**
 * Delete all document for each guild that have been remove when the bot was offline
 * @param guildId 
 */
 export const deleteGuildDataOfflined = async (client: Client): Promise<void> => {
    const guildsClient: Array<string> = client.guilds.cache.map(guild => guild.id);
    const guildsMongo: Array<string> = await (await guildsModal.find({})).map(guild => guild.guildId);

    let inc: number = 0
    guildsMongo.forEach(id => {
        if(guildsClient.includes(id))
            return;
        else {
            deleteGuildData(id);
            inc++
            console.log(inc + " ❌ deleted guilds which have been remove when the bot was offline, updating database...");
        }
    });
}