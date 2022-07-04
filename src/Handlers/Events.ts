import { Events } from '../Validation/EventNames';
import { promisify } from 'util';
import { glob } from 'glob';
import Ascii from 'ascii-table';
import { Event } from '../Typings/Event';

const globPromise = promisify(glob);

module.exports = async (client) => {
    const Table = new Ascii("Events Loaded");

    (await globPromise(`${process.cwd().replace(/\\/g, '/')}/src/Events/**/*.ts`)).map(async (file) => {
        const event: Event = require(file);
        if(!Events.includes(event['default'].name) || !event['default'].name) {
            const L = file.split("/");
            // TODO: STOP USING L[5] and L[6] cause it's can be another value in another computer
            await Table.addRow(`${event.name || "MISSING"}`, `❌ Event name either invalid or missing: ${L[5] + `/` + L[6]}`);
            return;
        }

        if(event['default'].once) {
            client.once(event['default'].name, (...args) => event['default'].execute(...args, client));
        } else {
            client.on(event['default'].name, (...args) => event['default'].execute(...args, client));
        };

        await Table.addRow(event['default'].name, "✔ SUCCESSFUL")
    })

    console.log(Table.toString());
}