import { createClient as createServerClient } from '@/lib/supabase/server';
import { YGCOUNCIL_TENANT_ID } from '@/lib/config/tenant';

export interface AdminDashboardMetrics {
  asksCount: number;
  proposalsTotalCount: number;
  proposalsReceivedCount: number;
  proposalsReviewCount: number;
  empathyCount: number;
  commentsVisibleCount: number;
  commentsDeletedCount: number;
  commentsHiddenCount: number;
  verificationsPendingCount: number;
  verificationsVerifiedCount: number;
  verificationsRejectedCount: number;
  outcomesPublishedCount: number;
  outcomesDraftCount: number;
  recentAuditLogs: {
    id: string;
    action: string;
    targetTable: string;
    createdAt: string;
  }[];
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  try {
    const supabase = await createServerClient();

    // 1. asks count
    const { count: asksCount } = await supabase
      .from('asks')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID);

    // 2. proposals counts
    const { count: proposalsTotalCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID);

    const { count: proposalsReceivedCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('status', 'received');

    const { count: proposalsReviewCount } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('status', 'review');

    // 3. proposal_empathy count
    const { count: empathyCount } = await supabase
      .from('proposal_empathy')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID);

    // 4. proposal_comments counts
    const { count: commentsVisibleCount } = await supabase
      .from('proposal_comments')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .is('deleted_at', null)
      .is('hidden_at', null);

    const { count: commentsDeletedCount } = await supabase
      .from('proposal_comments')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .not('deleted_at', 'is', null);

    const { count: commentsHiddenCount } = await supabase
      .from('proposal_comments')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .not('hidden_at', 'is', null);

    // 5. resident_verifications counts
    const { count: verificationsPendingCount } = await supabase
      .from('resident_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('residence_status', 'pending');

    const { count: verificationsVerifiedCount } = await supabase
      .from('resident_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('residence_status', 'verified');

    const { count: verificationsRejectedCount } = await supabase
      .from('resident_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('residence_status', 'rejected');

    // 6. outcomes counts
    const { count: outcomesPublishedCount } = await supabase
      .from('outcomes')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .in('status', ['published', 'completed', 'active']);

    const { count: outcomesDraftCount } = await supabase
      .from('outcomes')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .eq('status', 'draft');

    // 7. recent audit logs
    const { data: auditData } = await supabase
      .from('audit_logs')
      .select('id, action, target_table, created_at')
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentAuditLogs = (auditData || []).map((item: any) => ({
      id: item.id,
      action: item.action,
      targetTable: item.target_table,
      createdAt: new Date(item.created_at).toLocaleDateString('ko-KR'),
    }));

    return {
      asksCount: asksCount || 0,
      proposalsTotalCount: proposalsTotalCount || 0,
      proposalsReceivedCount: proposalsReceivedCount || 0,
      proposalsReviewCount: proposalsReviewCount || 0,
      empathyCount: empathyCount || 0,
      commentsVisibleCount: commentsVisibleCount || 0,
      commentsDeletedCount: commentsDeletedCount || 0,
      commentsHiddenCount: commentsHiddenCount || 0,
      verificationsPendingCount: verificationsPendingCount || 0,
      verificationsVerifiedCount: verificationsVerifiedCount || 0,
      verificationsRejectedCount: verificationsRejectedCount || 0,
      outcomesPublishedCount: outcomesPublishedCount || 0,
      outcomesDraftCount: outcomesDraftCount || 0,
      recentAuditLogs,
    };
  } catch (err) {
    console.error('Error fetching admin dashboard metrics:', err);
    return {
      asksCount: 0,
      proposalsTotalCount: 0,
      proposalsReceivedCount: 0,
      proposalsReviewCount: 0,
      empathyCount: 0,
      commentsVisibleCount: 0,
      commentsDeletedCount: 0,
      commentsHiddenCount: 0,
      verificationsPendingCount: 0,
      verificationsVerifiedCount: 0,
      verificationsRejectedCount: 0,
      outcomesPublishedCount: 0,
      outcomesDraftCount: 0,
      recentAuditLogs: [],
    };
  }
}
