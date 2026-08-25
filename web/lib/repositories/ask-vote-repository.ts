import { createClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export interface AskVoteResults {
  visible: boolean;
  reason?: string;
  hasVoted: boolean;
  totalParticipants: number;
  options: {
    optionId: string;
    label: string;
    sortOrder: number;
    voteCount: number;
  }[];
}

export async function hasUserVotedAsk(askId: string, userId: string | undefined): Promise<boolean> {
  if (!userId) return false;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('ask_vote_submissions')
      .select('id')
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('ask_id', askId)
      .eq('user_id', userId)
      .maybeSingle();

    return !!data;
  } catch (err) {
    console.error('Error checking user vote status:', err);
    return false;
  }
}

export async function getAskVoteResults(askId: string): Promise<AskVoteResults> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_ask_vote_results', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_ask_id: askId,
    });

    if (error || !data) {
      console.warn('RPC get_ask_vote_results error:', error);
      return {
        visible: true,
        hasVoted: false,
        totalParticipants: 0,
        options: [],
      };
    }

    const res = data as any;
    return {
      visible: res.visible ?? true,
      reason: res.reason,
      hasVoted: res.has_voted ?? false,
      totalParticipants: res.total_participants ?? 0,
      options: (res.options || []).map((o: any) => ({
        optionId: o.option_id,
        label: o.label,
        sortOrder: o.sort_order,
        voteCount: o.vote_count ?? 0,
      })),
    };
  } catch (err) {
    console.error('Error getting ask vote results:', err);
    return {
      visible: true,
      hasVoted: false,
      totalParticipants: 0,
      options: [],
    };
  }
}
