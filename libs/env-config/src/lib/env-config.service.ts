import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  GOOGLE_API_KEY: z.string(),
});

const parsedEnv = envSchema.parse(process.env);

@Injectable()
export class EnvConfigService {
  private env = parsedEnv;

  get(key: keyof typeof parsedEnv) {
    return this.env[key];
  }

  getAll() {
    return this.env;
  }
}
