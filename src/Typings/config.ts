export interface Config {
    // Cooldown of main loop of the bot (seconds)
    readyCooldown: number

    // Time needed between the last spawn (seconds)
    timeBetweenSpawn: number

    // Time needed between the last message to reset the count of message (seconds)
    timeBetweenMessage: number

    // Time to detect spamming of an user (seconds)
    spamTimeThreshold: number

    // message count needed to spawn a pokemon (integer)
    messageCountNeeded: number
}
