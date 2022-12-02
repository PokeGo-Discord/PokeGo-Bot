import { promisify } from 'util'
import { glob } from 'glob'
import Ascii from 'ascii-table'
import Client from '../Extends/ExtendsClient'
import { ApplicationCommandDataResolvable } from 'discord.js'
import { Collection } from 'mongoose'
import { Command } from '../Typings/Command'


const globPromise = promisify(glob)

/**
 * @param {Client} client
 */
module.exports = async (client: Client) => {
    const TableGlobal = new Ascii('Global Commands  Loaded');
    const TableOwner = new Ascii('Owner Commands Loaded')
    const commandPath = process.cwd().replace(/\\/g, '/') + '/src/Commands';

    (
        await globPromise(
            `${commandPath}/**/*.ts`, { ignore: `${commandPath}/Owner/*.ts` }
        )
    ).map(async (file) => {
        const command = require(file).default
        const L = file.split('/')

        if(!command || !command?.data?.name)
            await TableGlobal.addRow(`${L[6]}`, `❌ command name either invalid or missing`)

        client.commands.set(command.data.name, command)
        
        await TableGlobal.addRow(command.data.name, '✔ SUCCESSFUL')

        
    });

    (
        await globPromise(
            `${commandPath}/Owner/*.ts`
        )
    ).map(async (file) => {
        const command = require(file).default
        const L = file.split('/')

        if(!command || !command?.data.name)
            await TableOwner.addRow(`${L[6]}`, `❌ command name either invalid or missing`)

        client.guildCommands.set(command.data.name, command)
     
        await TableOwner.addRow(command.data.name, '✔ SUCCESSFUL')
    })


    console.log(TableGlobal.toString())
    console.log(TableOwner.toString())

}
