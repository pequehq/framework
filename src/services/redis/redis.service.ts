import * as redis from 'redis';
import { RedisClientOptions, RedisModules, RedisScripts } from 'redis';

class RedisService {
  async createClient(options?: RedisClientOptions<RedisModules, RedisScripts>): Promise<unknown> {
    const client = redis.createClient(options);
    await client.connect();
    return client;
  }
}

export const Redis = new RedisService();
