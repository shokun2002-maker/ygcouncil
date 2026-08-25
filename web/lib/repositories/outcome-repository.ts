import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';
import { Outcome } from '@/lib/types';

export interface OutcomeRecord {
  id: string;
  title: string;
  summary: string;
  result: string;
  category: string;
  status: string;
  regionName: string;
  outcomeAt: string;
  sourceProposalId?: string | null;
  sourceAskId?: string | null;
}

export async function getPublicOutcomes(): Promise<OutcomeRecord[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_public_outcomes', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
    });

    if (error || !data) {
      console.warn('RPC get_public_outcomes error:', error);
      return [];
    }

    const list = data as any[];
    return list.map((item: any) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      result: item.result,
      category: item.category,
      status: item.status,
      regionName: item.region_name || '영광군 전역',
      outcomeAt: item.outcome_at || '',
      sourceProposalId: item.source_proposal_id || null,
      sourceAskId: item.source_ask_id || null,
    }));
  } catch (err) {
    console.error('Error getting public outcomes:', err);
    return [];
  }
}

export async function getOutcomes(): Promise<Outcome[]> {
  const records = await getPublicOutcomes();
  return records.map((item) => {
    let sourceType: 'listen' | 'ask' | 'listen-to-ask' = 'listen';
    if (item.sourceProposalId && item.sourceAskId) {
      sourceType = 'listen-to-ask';
    } else if (item.sourceAskId) {
      sourceType = 'ask';
    }

    return {
      id: item.id,
      title: item.title,
      summary: item.summary,
      category: item.category,
      region: item.regionName,
      status: item.status === 'published' ? 'completed' : 'active',
      statusText: item.status === 'published' ? '추진완료' : '진행중',
      sourceType,
      sourceListenId: item.sourceProposalId || null,
      sourceAskId: item.sourceAskId || null,
      startedAt: item.outcomeAt || '',
      updatedAt: item.outcomeAt || '',
      outcomeDate: item.outcomeAt || '',
      steps: [],
      result: item.result,
      featured: false,
    };
  });
}

export async function getPublicOutcomeById(outcomeId: string): Promise<OutcomeRecord | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_public_outcome_by_id', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_outcome_id: outcomeId,
    });

    if (error || !data) {
      return null;
    }

    const item = data as any;
    return {
      id: item.id,
      title: item.title,
      summary: item.summary,
      result: item.result,
      category: item.category,
      status: item.status,
      regionName: item.region_name || '영광군 전역',
      outcomeAt: item.outcome_at || '',
      sourceProposalId: item.source_proposal_id || null,
      sourceAskId: item.source_ask_id || null,
    };
  } catch (err) {
    console.error('Error getting public outcome by id:', err);
    return null;
  }
}

export async function createOutcome(params: {
  title: string;
  summary: string;
  result: string;
  category: string;
  regionId?: string;
  status?: string;
  sourceProposalId?: string;
  sourceAskId?: string;
}): Promise<{ success: boolean; outcomeId?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: outcomeId, error } = await supabase.rpc('create_outcome', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_title: params.title,
      p_summary: params.summary,
      p_result: params.result,
      p_category: params.category,
      p_region_id: params.regionId,
      p_status: params.status || 'published',
      p_source_proposal_id: params.sourceProposalId,
      p_source_ask_id: params.sourceAskId,
    });

    if (error || !outcomeId) {
      return { success: false, error: error?.message || '성과 등록 실패' };
    }

    return { success: true, outcomeId: outcomeId as string };
  } catch (err: any) {
    console.error('Error creating outcome:', err);
    return { success: false, error: err?.message || '오류 발생' };
  }
}

export async function updateOutcome(params: {
  outcomeId: string;
  title: string;
  summary: string;
  result: string;
  category: string;
  regionId?: string;
  status?: string;
  sourceProposalId?: string;
  sourceAskId?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('update_outcome', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_outcome_id: params.outcomeId,
      p_title: params.title,
      p_summary: params.summary,
      p_result: params.result,
      p_category: params.category,
      p_region_id: params.regionId,
      p_status: params.status || 'published',
      p_source_proposal_id: params.sourceProposalId,
      p_source_ask_id: params.sourceAskId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error updating outcome:', err);
    return { success: false, error: err?.message || '오류 발생' };
  }
}
