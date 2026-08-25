import React from 'react';
import { notFound } from 'next/navigation';
import { getAskById } from '@/lib/repositories/ask-repository';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { hasUserVotedAsk, getAskVoteResults } from '@/lib/repositories/ask-vote-repository';
import AskDetailClient from './AskDetailClient';

interface AskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AskDetailPage({ params }: AskDetailPageProps) {
  const { id: askId } = await params;
  const ask = await getAskById(askId);

  if (!ask) {
    notFound();
  }

  const { user } = await getCurrentUser();
  const hasVoted = await hasUserVotedAsk(askId, user?.userId);
  const voteResults = await getAskVoteResults(askId);

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '48px 24px 80px 24px', color: '#1D1D1F' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <AskDetailClient
          ask={ask}
          currentUser={user}
          initialHasVoted={hasVoted}
          initialResults={voteResults}
        />
      </div>
    </main>
  );
}
