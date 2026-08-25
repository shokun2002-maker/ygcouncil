import { createClient } from '../supabase/client';
import { YGCOUNCIL_TENANT_ID } from '../config/tenant';
import { Outcome } from '../types';
import { MOCK_OUTCOMES } from '../mock/outcomes';

export async function getOutcomesClient(): Promise<Outcome[]> {
  try {
    const supabase = createClient();
    const { data: outcomeData, error: outcomeError } = await supabase
      .from('outcomes')
      .select(`
        id,
        title,
        summary,
        result,
        category,
        status,
        featured,
        started_at,
        outcome_at,
        created_at,
        regions (
          name
        ),
        outcome_steps (
          label,
          occurred_at,
          status,
          display_order
        )
      `)
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (outcomeError || !outcomeData || outcomeData.length === 0) {
      return MOCK_OUTCOMES;
    }

    return outcomeData.map((o: any) => ({
      id: o.id,
      title: o.title,
      summary: o.summary,
      result: o.result,
      category: o.category,
      region: o.regions?.name || '영광군 전체',
      status: o.status as any,
      statusText: o.status === 'completed' ? '처리완료' : '추진중',
      sourceType: 'listen-to-ask',
      startedAt: o.started_at || '2026.08.15',
      updatedAt: '2026.08.24',
      outcomeDate: o.outcome_at || '2026.08.24',
      steps: (o.outcome_steps || []).map((s: any) => ({
        label: s.label,
        date: s.occurred_at ? new Date(s.occurred_at).toISOString().slice(0, 10).replace(/-/g, '.') : '-',
        status: s.status as any,
      })),
      featured: o.featured || false,
      isDemo: true,
    }));
  } catch (err) {
    console.warn('Outcomes client query fallback used:', err);
    return MOCK_OUTCOMES;
  }
}

export async function getOutcomeByIdClient(id: string): Promise<Outcome | null> {
  const allOutcomes = await getOutcomesClient();
  const found = allOutcomes.find((o) => o.id === id);
  if (found) return found;
  return MOCK_OUTCOMES.find((o) => o.id === id) || null;
}
