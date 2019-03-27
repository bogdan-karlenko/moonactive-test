const scheduleMessage = require('./helpers').scheduleMessage;

module.exports = async (req, res) => {
    const message = req.body.message;
    const time = req.body.time;
    if(!message || !time) {
        res.status(400).send('Both message and time should be provided');
    } else {
        console.log(`-REQUEST- Will schedule on ${ new Date(time) } to echo message "${message}"`);
        res.status(200).send(await scheduleMessage(message, +(new Date(time))));
    }
}
