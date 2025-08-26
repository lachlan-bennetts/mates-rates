import { z } from 'zod';

export const DealCategory = z.enum([
  'HAPPY_HOUR',
  '2_FOR_1',
  'EVENT',
  'FOOD_SPECIAL',
]);

export const ScrapeSelectorMetadata = z.object({
  tagName: z.string(),
  classList: z.array(z.string()),
  parentClass: z.array(z.string()).optional(),
  textContent: z.string().optional(),
});

export const ScrapeInfoSchema = z.object({
  selector: z.array(z.string()).min(1), // CSS selectors or DOM paths
  mapId: z.string(),
  selectorMetadata: ScrapeSelectorMetadata,
  sourceUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
  evidenceSnippet: z
    .object({ text: z.string().optional(), html: z.string().optional() })
    .partial()
    .optional(),
  pageChecksum: z.string().optional(),
  extractionEngine: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const DealSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  category: DealCategory,
  price: z.number().nonnegative().optional().nullable(),
  validTo: z.string().date().optional().nullable(), // ISO date string
  sourceUrl: z.string().url().optional(), // canonical
  imageUrl: z.string().url().optional(),
  daysActive: z.array(z.number().int().min(0).max(6)).nonempty(),
  scrapeDatum: ScrapeInfoSchema,
});

export const ExtractionOutputSchema = z.object({
  bar: z.object({
    id: z.string().uuid().optional(), // if you have it
    mapId: z.string(),
    name: z.string(),
    suburb: z.string().optional(),
    primaryUrl: z.string().url(),
  }),
  deals: z.array(DealSchema),
  unparsed_blocks: z.array(z.string()).optional(),
});
