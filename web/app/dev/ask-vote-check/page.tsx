import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getAskVoteResults, hasUserVotedAsk } from '@/lib/repositories/ask-vote-repository';

export default async function DevAskVoteCheckPage() {
  const { user } = await getCurrentUser();
  const testAskId = '10000000-0000-0000-0000-000000000004';
  const hasVoted = await hasUserVotedAsk(testAskId, user?.userId);
  const results = await getAskVoteResults(testAskId);

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', color: '#92400E' }}>
        ⚠️ <strong>개발자 전용 「묻습니다」 투표 파이프라인 검증 페이지</strong>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
        🗳️ Ask Vote Pipeline Check
      </h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <strong>Authenticated User:</strong> {user?.displayName || 'Anonymous'} <br />
          <strong>Tenant Membership Role:</strong> {user?.role || 'none'} <br />
          <strong>Is Verified Resident:</strong>{' '}
          <span style={{ color: user?.isVerifiedResident ? '#059669' : '#DC2626', fontWeight: 700 }}>
            {user?.isVerifiedResident ? '✅ TRUE (투표 가능)' : '❌ FALSE (투표 권한 없음)'}
          </span>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Target Test Ask (`10000000-0000-0000-0000-000000000004`)
          </h2>
          <div><strong>Already Voted by User:</strong> {hasVoted ? '✅ YES' : '⚪ NO'}</div>
          <div><strong>DB Total Submissions:</strong> {results.totalParticipants}명</div>
          <div><strong>Results Visible:</strong> {results.visible ? '✅ TRUE' : '❌ FALSE'}</div>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Option Vote Counts (DB Aggregated)</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
            {results.options.map((opt) => (
              <li key={opt.optionId} style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{opt.label}</span>
                <strong>{opt.voteCount}표</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
