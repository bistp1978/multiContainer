const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
      host: keys.redisHost,
      port: keys.redisPort,
      reconnectStrategy: (retries) => {
        return Math.min(retries * 50, 500);
      },
    },
}); 


redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const sub = redisClient.duplicate();

(async () => {
    await redisClient.connect();
    await sub.connect();
})().catch(console.error);

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}


sub.subscribe('insert', (message) => {
    console.log('Subscription to insert channel established.');
    redisClient.hSet('values', message, fib(parseInt(message)));
});