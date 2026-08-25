import { createClient } from '../supabase/server';
import { YGCOUNCIL_TENANT_ID } from '../config/tenant';
import { Proposal } from '../types';
import { MOCK_LISTEN_DATA } from '../mock/listens';

export async function getProposals(): Promise<Proposal[]> {
  try {
    const supabase = await createClient();
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        id,
        category,
        title,
        summary,
        content,
        status,
        public_discussion_eligible,
        featured,
        created_at,
        regions (
          name
        ),
        official_responses (
          department,
          content,
          responded_at
        )
      `)
      .eq('tenant_id', YGCOUNCIL_TENANT_ID)
      .neq('status', 'hidden')
      .is('deleted_at', null)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (proposalError || !proposalData || proposalData.length === 0) {
      return MOCK_LISTEN_DATA;
    }

    return proposalData.map((p: any) => ({
      id: p.id,
      category: p.category,
      title: p.title,
      summary: p.summary,
      content: p.content,
      region: p.regions?.name || '영광군 전체',
      createdAt: new Date(p.created_at).toISOString().slice(0, 10).replace(/-/g, '.'),
      status: p.status,
      statusText: getStatusText(p.status),
      empathyCount: 0,
      commentCount: 0,
      viewCount: 1,
      authorDisplay: '군민',
      timeline: [
        { step: '의견 접수', date: new Date(p.created_at).toISOString().slice(0, 10).replace(/-/g, '.'), status: 'completed' },
        { step: '의회 검토중', date: '-', status: 'pending' },
      ],
      adminResponse: p.official_responses && p.official_responses.length > 0 ? {
        department: p.official_responses[0].department,
        date: new Date(p.official_responses[0].responded_at).toISOString().slice(0, 10).replace(/-/g, '.'),
        content: p.official_responses[0].content,
      } : undefined,
      publicDiscussionEligible: p.public_discussion_eligible || false,
      featured: p.featured || false,
      isDemo: true,
    }));
  } catch (err) {
    console.warn('Proposals query fallback used:', err);
    return MOCK_LISTEN_DATA;
  }
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  const allProposals = await getProposals();
  const found = allProposals.find((p) => p.id === id);
  if (found) return found;
  return MOCK_LISTEN_DATA.find((p) => p.id === id) || null;
}

function getStatusText(status: string): string {
  switch (status) {
    case 'received': return '접수';
    case 'review': return '의회 검토중';
    case 'visit': return '현장방문 완료';
    case 'reflected':
    case 'completed': return '의정 반영 완료';
    default: return '접수';
  }
}
