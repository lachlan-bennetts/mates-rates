import OpenAI from 'openai';
import { EnvConfigService } from '@mates-rates/env-config';
import { Injectable } from '@nestjs/common';
import puppeteer, { executablePath } from 'puppeteer-core';

@Injectable()
export class ScraperService {
  private readonly client: OpenAI;

  constructor(private env: EnvConfigService) {
    this.client = new OpenAI({
      apiKey: this.env.get('OPENAI_API_KEY'),
    });
  }

  instantiateOpenAiClient() {
    return this.client;
  }

  async scraper(websiteUrl: string) {
    const browser = await puppeteer.launch({
      headless: 'shell',
      executablePath:
        '~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
    const page = await browser.newPage();

    // Navigate to bar website
    await page.goto('');

    // Set screen size.
    await page.setViewport({ width: 1920, height: 1080 });

    const pageHtml = await page.content();
    console.log(pageHtml);
    const loweredPageHtml = pageHtml.toLowerCase();
    const openAi = this.instantiateOpenAiClient();

    const response = await openAi.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'developer',
          content: `Below is the HTML of a bar, I need you to find the happy hour for this bar and store it in a JSON format
          as follows: 
          {
            happyHourDays: string (example Mon-Fri),
            happyHourStart: string (In 24 hour notation, example: 16:00),
            happyHourEnd: string (In 24 hour notation, example: 19:00),
            // Below is for when the hours may change on a different day of the week.
            happyHourDays: string (example Mon-Fri),
            happyHourStart: string (In 24 hour notation, example: 16:00),
            happyHourEnd: string (In 24 hour notation, example: 19:00),
          }`,
        },
      ],
    });

    console.log(response.choices[0].message.content);
  }
}
