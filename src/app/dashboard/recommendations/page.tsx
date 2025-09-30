import { PageHeader } from '@/components/page-header';
import { RecommendationsClient } from './components/recommendations-client';

export default function RecommendationsPage() {
  return (
    <>
      <PageHeader
        title="Recomendações"
        description="Obtenha insights para otimizar suas compras e maximizar lucros."
      />
      <RecommendationsClient />
    </>
  );
}
