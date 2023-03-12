const fs = require('fs')

module.exports = async (client) => {
    fs.readdirSync("./src/events").forEach((dirs) => {
            const files = fs.readdirSync(`${client.eventDir}${dirs}`).filter((file) => file.endsWith(".js"))

            for (file of files) {
                const event = require(`${process.cwd()}/src/events/${dirs}/${file}`)
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            }
    })
}