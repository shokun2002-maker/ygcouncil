import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export const metadata = {
  title: '영광군의회 열린소통 ON | 묻고, 듣고, 함께 바꿉니다.',
  description: '영광군의회가 군민에게 묻고, 군민의 목소리를 들으며, 함께 변화를 만들어가는 군민 참여 의정 플랫폼입니다.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUser();

  return (
    <html lang="ko">
      <body>
        <Header currentUser={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
