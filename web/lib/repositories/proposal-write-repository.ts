import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export interface ProposalSubmissionPayload {
  regionId: string;
  category: string;
  title: string;
  content: string;
}

export async function submitCitizenProposal(payload: ProposalSubmissionPayload): Promise<{ success: boolean; proposalId?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: proposalId, error } = await supabase.rpc('submit_citizen_proposal', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_region_id: payload.regionId,
      p_category: payload.category,
      p_title: payload.title,
      p_content: payload.content,
    });

    if (error) {
      console.error('RPC submit_citizen_proposal error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, proposalId: proposalId as string };
  } catch (err: any) {
    console.error('Error submitting citizen proposal:', err);
    return { success: false, error: err?.message || '제안 등록 중 오류가 발생했습니다.' };
  }
}
