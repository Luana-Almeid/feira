// RecommendOrderQuantities.ts
'use server';

/**
 * @fileOverview AI agent that recommends order quantities based on sales data and current inventory.
 *
 * - recommendOrderQuantities - A function that recommends the purchase quantities for each product.
 * - RecommendOrderQuantitiesInput - The input type for the recommendOrderQuantities function.
 * - RecommendOrderQuantitiesOutput - The return type for the recommendOrderQuantities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendOrderQuantitiesInputSchema = z.object({
  salesData: z
    .string()
    .describe('Historical sales data for each product, in JSON format.'),
  currentInventory: z
    .string()
    .describe('Current inventory levels for each product, in JSON format.'),
});
export type RecommendOrderQuantitiesInput = z.infer<
  typeof RecommendOrderQuantitiesInputSchema
>;

const RecommendOrderQuantitiesOutputSchema = z.object({
  orderRecommendations: z
    .string()
    .describe(
      'Recommended order quantities for each product, in JSON format.'
    ),
});
export type RecommendOrderQuantitiesOutput = z.infer<
  typeof RecommendOrderQuantitiesOutputSchema
>;

export async function recommendOrderQuantities(
  input: RecommendOrderQuantitiesInput
): Promise<RecommendOrderQuantitiesOutput> {
  return recommendOrderQuantitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendOrderQuantitiesPrompt',
  input: {schema: RecommendOrderQuantitiesInputSchema},
  output: {schema: RecommendOrderQuantitiesOutputSchema},
  prompt: `You are an expert in inventory management and sales forecasting for fresh produce vendors.  
Based on the historical sales data and current inventory levels provided, recommend the optimal order quantities for each product to minimize waste and maximize profit.

Sales Data: {{{salesData}}}
Current Inventory: {{{currentInventory}}}

Consider factors such as product perishability, seasonal demand, and potential spoilage.

Provide the output in JSON format. The keys of the JSON should be the product names and values of the JSON should be the recommended order quantities for each product.`,
});

const recommendOrderQuantitiesFlow = ai.defineFlow(
  {
    name: 'recommendOrderQuantitiesFlow',
    inputSchema: RecommendOrderQuantitiesInputSchema,
    outputSchema: RecommendOrderQuantitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
