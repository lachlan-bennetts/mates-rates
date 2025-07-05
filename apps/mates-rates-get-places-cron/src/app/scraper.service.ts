import OpenAI from 'openai';
import { EnvConfigService } from '@mates-rates/env-config';
import { Injectable } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';

interface imageMatch {
  imgSrc: string;
  contextText: string;
}

interface textMatch {
  tag: string | null;
  text: string | null;
  class: string | null;
  link: string | null;
  id: string | null;
}

interface allMatches {
  textMatch: textMatch[];
  imageMatch: imageMatch[];
  potentialPages: textMatch[];
}

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

  private async scrollToBottom(page: Page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
      });
    });
  }

  async scrapePageForHappyHour(url: string): Promise<{
    textMatch: textMatch[];
    imageMatch: imageMatch[];
    potentialPages: textMatch[];
  }> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Check for happy hour text mentions on initial webpage.
      const happyHourKeywords = ['happy hour', 'happy-hour', 'happy_hour'];
      const happyHourMatches = await this.getTextMatches(
        page,
        ['body *'],
        happyHourKeywords
      );

      const whatsOnKeywords = ['whatson', 'whats-on', 'whats_on'];
      const whatsOnSelectors = ['a', 'button'];
      const whatsOnMatches = await this.getTextMatches(
        page,
        whatsOnKeywords,
        whatsOnSelectors
      );

      // await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Step 3: Find images + associated text for happy hour variants
      const imageHhKeywords = ['happyhour', 'happy-hour', 'happy_hour'];
      const imageMatches = await this.getImageMatches(page, imageHhKeywords);

      const allMatches = {
        textMatch: happyHourMatches,
        imageMatch: imageMatches,
        potentialPages: whatsOnMatches,
      };

      return allMatches;
    } catch (err) {
      console.error(`Error scraping ${url}:`, err);
      return {
        textMatch: [],
        imageMatch: [],
        potentialPages: [],
      };
    } finally {
      await browser.close();
    }
  }

  async getImageMatches(
    page: Page,
    matchKeywords: string[]
  ): Promise<imageMatch[]> {
    const result = await page.$$eval('img', (images) => {
      const imageMatches: imageMatch[] = [];
      images.forEach((img) => {
        const parent = img.closest('div, section, article');
        const context = parent?.innerHTML || '';
        const cleaned = context.toLowerCase().replace(/\s/g, '');

        if (matchKeywords.some((k) => cleaned.includes(k))) {
          imageMatches.push({
            imgSrc: img.src,
            contextText: parent?.innerHTML.trim() || '',
          });
        }
      });
      return imageMatches;
    });
    return result;
  }

  async getTextMatches(
    page: Page,
    selectors: string[],
    matchKeywords: string[]
  ) {
    const textMatchedElements = await page.evaluate(() => {
      const matches: textMatch[] = [];

      // Loop through all elements in the body
      document.querySelectorAll(`${selectors.join(',')}`).forEach((el) => {
        const style = window.getComputedStyle(el);
        const isVisible =
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          (el as HTMLElement).innerText !== null;

        const text = (el as HTMLElement).innerText.trim();

        if (isVisible && text) {
          const matchFound = matchKeywords.some((matchKeyword) =>
            text.includes(matchKeyword)
          );
          if (matchFound) {
            matches.push({
              tag: el.tagName.toLowerCase(),
              text: text,
              class: el.className || null,
              link: (el as HTMLAnchorElement).href || null,
              id: el.id || null,
            });
          }
        }
      });

      return matches;
    });
    return textMatchedElements;
  }
}
