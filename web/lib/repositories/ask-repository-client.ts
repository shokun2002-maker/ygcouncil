import { createClient } from '../supabase/client';
import { YGCOUNCIL_TENANT_ID } from '../config/tenant';
import { Ask } from '../types';
import { MOCK_ASKS } from '../mock/asks';

export async function getAsksClient(): Promise<Ask[]> {
  try {
    const supabase = createClient();
    const { data: asksData, error: asksError } = await supabase
      .from('asks')
      .select(`
        id,
        category,
        title,
        summary,
        description,
        background,
        status,
        start_at,
        end_at,
        survey_type,
        max_select_count,
        allow_comment,
        result_visibility,
        featured,
        ask_options (
          id,
          label,
          display_order
        )
      `)
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .in('status', ['published', 'active', 'closed', 'archived'])
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (asksError || !asksData || asksData.length === 0) {
      return MOCK_ASKS;
    }

    return asksData.map((a: any) => ({
      id: a.id,
      category: a.category,
      title: a.title,
      summary: a.summary,
      description: a.description || '',
      background: a.background || '',
      status: a.status === 'published' || a.status === 'active' ? 'active' : 'closed',
      statusText: a.status === 'active' ? '수렴중' : '마감',
      startDate: a.start_at ? new Date(a.start_at).toISOString().slice(0, 10).replace(/-/g, '.') : '2026.08.20',
      endDate: a.end_at ? new Date(a.end_at).toISOString().slice(0, 10).replace(/-/g, '.') : '2026.09.20',
      participantCount: 0,
      surveyType: (a.survey_type as any) || 'single',
      options: (a.ask_options || []).map((o: any) => ({
        id: o.id,
        label: o.label,
        votes: 0,
      })),
      maxSelectCount: a.max_select_count || 1,
      allowComment: a.allow_comment ?? true,
      region: '영광군 전체',
      featured: a.featured || false,
      resultVisibility: (a.result_visibility as any) || 'after-vote',
    }));
  } catch (err) {
    console.warn('Asks client query fallback used:', err);
    return MOCK_ASKS;
  }
}

export async function getAskByIdClient(id: string): Promise<Ask | null> {
  const allAsks = await getAsksClient();
  const found = allAsks.find((a) => a.id === id);
  if (found) return found;
  return MOCK_ASKS.find((a) => a.id === id) || null;
}
