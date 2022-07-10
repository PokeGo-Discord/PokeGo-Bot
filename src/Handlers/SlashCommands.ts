import { promisify } from 'util'
import { glob } from 'glob'
import Ascii from 'ascii-table'
import Client from '../Extends/ExtendsClient'


const globPromise = promisify(glob)

/**
 * @param {Client} client
 */
module.exports = async (client: Client) => {
    const Table = new Ascii('Commands  Loaded');
    (
        await globPromise(
            `${process.cwd().replace(/\\/g, '/')}/src/Commands/Slash/*.ts`
        )
    ).map(async (file) => {
        const command = require(file).default
        const L = file.split('/')

        if(!command || !command?.data?.name)
            await Table.addRow(`${L[6]}`, `❌ command name either invalid or missing`)

        client.commands.set(command.data.name, command)

        await Table.addRow(command.data.name, '✔ SUCCESSFUL')
    })

    console.log(Table.toString())
}
