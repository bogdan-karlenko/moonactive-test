const redis = require('./redis');

const scheduleMessage = async (message, time) => {
    const messageData = { added: +(new Date()), message };
    await redis.zadd('pending', [time, JSON.stringify(messageData)]);
    return `Will schedule on ${new Date(time)} to echo message "${message}"`;
}

const run = async () => {
const res = await redis.zrange('pending', 0, 0, "WITHSCORES");
    console.log('I\'m running!'+ res);
}

module.exports = {
    scheduleMessage,
    run
}
