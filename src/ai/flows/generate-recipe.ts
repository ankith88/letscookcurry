import { z } from 'genkit';
import { ai } from '@/ai/genkit';

export const GenerateRecipeInputSchema = z.object({
  prompt: z
    .string()
    .min(2)
    .describe('Dish name or rough kitchen notes for an Indian curry or dish'),
});

export const GenerateRecipeOutputSchema = z.object({
  name: z.string().describe('Full title of the Indian curry or dish'),
  description: z
    .string()
    .describe('Concise 1-2 sentence appetizing summary for recipe cards'),
  longDescription: z
    .string()
    .describe(
      'Rich 2-4 sentence culinary story describing the regional origin, spice profile, and texture'
    ),
  imageHint: z
    .string()
    .describe('Two-word descriptive hint for the dish photo, e.g. "butter chicken"'),
  price: z.number().describe('Suggested price in AUD between 15 and 26'),
  region: z
    .enum(['North', 'South', 'East', 'West'])
    .describe('Primary Indian region of origin'),
  diet: z.enum(['Veg', 'Non-Veg']).describe('Dietary classification'),
  spice: z
    .enum(['mild', 'medium', 'hot', 'very-hot'])
    .describe('Spice heat level'),
  ingredients: z
    .array(z.string())
    .describe('Ordered list of ingredients with exact home-cooking measurements'),
  instructions: z
    .array(z.string())
    .describe('Clear step-by-step cooking instructions'),
});

export type GenerateRecipeDraftOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export const generateRecipeDraftFlow = ai.defineFlow(
  {
    name: 'generateRecipeDraftFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async ({ prompt }) => {
    const { output } = await ai.generate({
      prompt: `You are the head chef at "Let's Cook Curry" in Sydney, Australia (founded by Tanvi & Ankith).
Generate an authentic, home-style Indian recipe draft based on the following dish name or kitchen notes:
"${prompt}"

Make sure the ingredients include clear metric/Australian home kitchen measurements and the step-by-step instructions explain how to bloom/temper the whole spices properly.`,
      output: { schema: GenerateRecipeOutputSchema },
    });

    if (!output) {
      throw new Error('Failed to generate recipe draft from AI.');
    }

    return output;
  }
);

