const redis = require('./redis');

const scheduleMessage = async (message, time) => {
    const messageData = { added: +(new Date()), message };
    await redis.zadd('pending', [time, JSON.stringify(messageData)]);
    return `Will schedule on ${new Date(time)} to echo message "${message}"`;
}

const run = async () => {
    try {
        // checking if we have hanging processing messages
        let [nextPendingMessageData, nextPendingTime] = await redis.zpopmin('processing');
        if (!nextPendingMessageData) {
            // take first pending message if no messages hanging
            [nextPendingMessageData, nextPendingTime] = await redis.zpopmin('pending');
        }
        // check if this message was already processed (may be skipped for operations economy)
        if (nextPendingMessageData && !(await isAlreadyProcessed(nextPendingMessageData))) {
            // check if it's time to show message (accurate to 1s)
            if (+nextPendingTime < +(new Date()) + 1000) {
                const message = JSON.parse(nextPendingMessageData).message;
                // moving message to "processing" state
                await redis.zadd('processing', nextPendingTime, nextPendingMessageData);
                await redis.zrem('pending', nextPendingMessageData);
                await processMessage(message);
                // removing message from "processing" state
                await redis.zrem('processing', nextPendingMessageData);
                // saving 5 last operations to prevent message duplication
                // following part may be skipped for Redis operations economy
                await redis.lpush('processed', nextPendingMessageData);
                await redis.ltrim('processed', 0, 4);
            } else {
                // don't like this read and write at every tick, but this is to prevent message duplication
                await redis.zadd('pending', [nextPendingTime, nextPendingMessageData]);
            }
        }
    } catch (err) {
        throw(err);
    }
}

const processMessage = async (message) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(`-ECHO- ${new Date()}: ${message}`);
            resolve();
        } catch (err) {
            reject(err);
        }
    })
}

const isAlreadyProcessed = async (messageData) => {
    const processedMessages = await redis.lrange('processed', 0, -1);
    return processedMessages.includes(messageData);
}


module.exports = {
    scheduleMessage,
    run
}
