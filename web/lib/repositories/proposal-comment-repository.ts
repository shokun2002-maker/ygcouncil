import { createClient } from '@/lib/supabase/client';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export interface ProposalCommentItem {
  commentId: string;
  content: string;
  createdAt: string;
  authorDisplay: string;
  isMyComment: boolean;
}

export async function getProposalComments(proposalId: string): Promise<ProposalCommentItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_proposal_comments', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_proposal_id: proposalId,
    });

    if (error || !data) {
      console.warn('RPC get_proposal_comments error:', error);
      return [];
    }

    const list = data as any[];
    return list.map((c: any) => ({
      commentId: c.comment_id,
      content: c.content,
      createdAt: new Date(c.created_at).toLocaleDateString('ko-KR'),
      authorDisplay: c.author_display || '군민인증 회원',
      isMyComment: !!c.is_my_comment,
    }));
  } catch (err) {
    console.error('Error getting proposal comments:', err);
    return [];
  }
}

export async function submitProposalComment(proposalId: string, content: string): Promise<{ success: boolean; commentId?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: commentId, error } = await supabase.rpc('submit_proposal_comment', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_proposal_id: proposalId,
      p_content: content,
    });

    if (error || !commentId) {
      return { success: false, error: error?.message || '댓글 작성 실패' };
    }

    return { success: true, commentId: commentId as string };
  } catch (err: any) {
    console.error('Error submitting proposal comment:', err);
    return { success: false, error: err?.message || '오류 발생' };
  }
}

export async function deleteMyProposalComment(commentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('delete_my_proposal_comment', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_comment_id: commentId,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error deleting proposal comment:', err);
    return { success: false, error: err?.message || '오류 발생' };
  }
}

export async function hideProposalComment(commentId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('hide_proposal_comment', {
      p_tenant_id: YGCOUNCIL_TENANT_ID,
      p_comment_id: commentId,
      p_reason: reason,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error hiding proposal comment:', err);
    return { success: false, error: err?.message || '오류 발생' };
  }
}
