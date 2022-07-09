import Discord, { ClientOptions, Collection } from "discord.js";
import { Command } from '../Typings/Command'

export default class Client extends Discord.Client {
    commands:Collection<String, Command> = new Collection();

    constructor(options: ClientOptions) {
        super(options)
    }
}