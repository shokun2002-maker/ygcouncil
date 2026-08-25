import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export interface ProposalEmpathyState {
  empathized: boolean;
  empathyCount: number;
}

export async function getProposalEmpathyStatus(proposalId: string): Promise<ProposalEmpathyState> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_proposal_empathy_status', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_proposal_id: proposalId,
    });

    if (error || !data) {
      return { empathized: false, empathyCount: 0 };
    }

    const res = data as any;
    return {
      empathized: !!res.empathized,
      empathyCount: Number(res.empathy_count || 0),
    };
  } catch (err) {
    console.error('Error getting proposal empathy status:', err);
    return { empathized: false, empathyCount: 0 };
  }
}

export async function toggleProposalEmpathy(proposalId: string): Promise<{ success: boolean; empathized?: boolean; empathyCount?: number; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('toggle_proposal_empathy', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_proposal_id: proposalId,
    });

    if (error || !data) {
      return { success: false, error: error?.message || '공감 처리 실패' };
    }

    const res = data as any;
    return {
      success: true,
      empathized: !!res.empathized,
      empathyCount: Number(res.empathy_count || 0),
    };
  } catch (err: any) {
    console.error('Error toggling proposal empathy:', err);
    return { success: false, error: err?.message || '오류 발생' };
  }
}
