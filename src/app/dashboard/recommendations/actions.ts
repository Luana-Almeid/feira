'use server';
import { recommendOrderQuantities } from '@/ai/flows/recommend-order-quantities';

export type RecommendationResult = {
    [productName: string]: number;
} | { error: string };

export async function getRecommendationsAction(
  salesData: string,
  currentInventory: string
): Promise<RecommendationResult> {
  try {
    const result = await recommendOrderQuantities({
      salesData,
      currentInventory,
    });
    if (result && result.orderRecommendations) {
        return JSON.parse(result.orderRecommendations);
    }
    return { error: 'A resposta da IA não continha recomendações.' };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    if (error instanceof Error) {
        return { error: `Falha ao obter recomendações: ${error.message}` };
    }
    return { error: 'Ocorreu um erro desconhecido ao obter recomendações.' };
  }
}
