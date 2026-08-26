import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getProposalComments } from '@/lib/repositories/proposal-comment-repository';

export default async function DevProposalCommentCheckPage() {
  const { user } = await getCurrentUser();
  const testProposalId = '20000000-0000-0000-0000-000000000001';
  const comments = await getProposalComments(testProposalId);

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발자 전용 「듣습니다」 제안 댓글 파이프라인 검증 페이지</strong>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        💬 Proposal Comment Pipeline Check
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Authenticated User:</strong> {user?.displayName || 'Anonymous'} <br />
          <strong>Tenant Membership Role:</strong> {user?.role || 'none'} <br />
          <strong>Is Verified Resident:</strong>{' '}
          <span style={{ color: user?.isVerifiedResident ? '#059669' : '#DC2626', fontWeight: 700 }}>
            {user?.isVerifiedResident ? '✅ TRUE (댓글 작성 가능)' : '❌ FALSE (작성 권한 없음)'}
          </span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Target Test Proposal (`20000000-0000-0000-0000-000000000001`)
          </h2>
          <div><strong>Visible DB Comments Count:</strong> {comments.length}개</div>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Recent Comments</h2>
          {comments.length === 0 ? (
            <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>등록된 댓글이 없습니다.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
              {comments.map((c) => (
                <li key={c.commentId} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{c.authorDisplay}</span>
                    <span>{c.createdAt}</span>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '0.9375rem', color: '#0F172A' }}>{c.content}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
