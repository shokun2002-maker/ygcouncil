import React from 'react';
import Link from 'next/link';
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
    <main className="ask-detail-container">
      <AskDetailClient
        ask={ask}
        currentUser={user}
        initialHasVoted={hasVoted}
        initialResults={voteResults}
      />
    </main>
  );
}
