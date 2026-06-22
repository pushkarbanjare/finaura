import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function enqueueExpenseJob(job: {
  expenseId: string;
  item: string;
  merchant?: string;
  notes?: string;
}) {
  await redis.rpush("expense-category-jobs", JSON.stringify(job));
}
