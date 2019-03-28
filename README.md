# moonactive-test

## Prerequisites
Redis server starting from version 5 has to be running.  
Create and fill in .env file, like PORT=3000, REDIS_URI="redis://localhost:6379/0"

## Run
`npm i`
`npm start`

Server will wait for incoming schedule messages on 'http://localhost:3000/echoAtTime'.  
Body of the POST message should look like following: {"message": "Some text to echo here", "time": "2019-03-28 18:23:55 GMT+2"}
All events will be printed to console.  

## Exit
Use Ctrl+C to stop execution. Stop redis-server manualy.  
