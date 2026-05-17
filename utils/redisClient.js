// 












// const { createClient } = require("redis");

// const client = createClient({
//     socket: {
//         host: "127.0.0.1",
//         port: 6379,
//         connectTimeout: 10000
//     }
// });

// client.on("error", err => {
//     console.log("Redis Client Error", err);
// });

// (async () => {
//     try {
//         await client.connect();

//         console.log("✅ Redis Connected");

//         await client.set("foo", "bar");

//         const result = await client.get("foo");

//         console.log(result);

//     } catch (err) {
//         console.error("Redis connection failed:", err);
//     }
// })();

// async function getCash(key) {
//     return await client.get(key);
// }

// async function setCash(key, value) {
//     await client.set(key, value);
// }

// async function deleteCash(key) {
//     return await client.del(key);
// }

// module.exports = {
//     getCash,
//     setCash,
//     deleteCash
// };




const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redis.on("error", (err) => {
  console.log("Redis Error:", err);
});

(async () => {
    try {
        await redis.connect();

        console.log("✅ Redis Connected");

    } catch (err) {
        console.error("Redis connection failed:", err);
    }
})();




async function connectRedis() {
  await redis.connect();
  console.log("✅ Redis Connected");
}

async function getCache(key) {
  return await redis.get(key);
}

async function setCache(key, value) {
  return await redis.set(key, value);
}

async function deleteCache(key) {
  return await redis.del(key);
}
module.exports = {
  getCach:getCache,
  setCash:setCache,
  deleteCash:deleteCache,
};