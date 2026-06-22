// import { Queue } from "bullmq";
// import IORedis from "ioredis";

// const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null, tls: {}, });
// export const categorizationQueue = new Queue("categorization", { connection });

import { Queue } from "bullmq";

export const categorizationQueue = new Queue("categorization", {
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD!,
    tls: {},
  },
});