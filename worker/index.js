const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    reconnectStrategy: () => 1000,
    },
});

const sub = redisClient.duplicate();

redisClient.connect().catch(console.error);
sub.connect().catch(console.error);

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}


sub.subscribe('insert', (message) => {
    console.log('Subscription to insert channel established.');
    redisClient.hset('values', message, fib(parseInt(message)));
});