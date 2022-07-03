const { Events } = require('../Validation/EventNames');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

module.exports = async (client) => {
    const Table = new Ascii("Events Loaded");

    (await PG(`${process.cwd().replace(/\\/g, '/')}/Events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if(!Events.includes(event.name) || !event.name) {
            const L = file.split("/");
            // TODO: STOP USING L[4] and L[5] cause it's can be another value in another computer
            await Table.addRow(`${event.name || "MISSING"}`, `❌ Event name either invalid or missing: ${L[4] + `/` + L[5]}`);
            return;
        }

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        };

        await Table.addRow(event.name, "✔ SUCCESSFUL")
    })

    console.log(Table.toString());
}