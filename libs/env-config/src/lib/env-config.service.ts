import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DB_PORT: z.string().default('3000'),
  DB_HOST: z.string().default('postgres'),
  DB_USER: z.string().default('user'),
  DB_PASS: z.string().default('password'),
  DB_NAME: z.string().default('mates-rates-store'),
  OPENAI_API_KEY: z.string(),
});

const parsedEnv = envSchema.parse(process.env);

@Injectable()
export class EnvConfigService {
  private env = parsedEnv;

  get(key: keyof typeof parsedEnv) {
    return this.env[key];
  }
}
