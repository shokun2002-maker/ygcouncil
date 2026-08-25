import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <main className="content-area" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: 'white',
        padding: '36px 28px',
        borderRadius: '16px',
        border: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '12px' }}>
          로그인 처리 중 문제가 발생했습니다
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '28px' }}>
          인증 서비스 연동 또는 응답 과정에서 에러가 일어났습니다.<br />
          잠시 후 다시 시도해 주시기 바랍니다.
        </p>

        <Link
          href="/"
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 24px',
            fontWeight: 700,
            borderRadius: '8px',
            textDecoration: 'none',
            width: '100%'
          }}
        >
          메인 페이지로 돌아가기
        </Link>
      </div>
    </main>
  );
}
