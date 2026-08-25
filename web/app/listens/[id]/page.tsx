import React from 'react';
import { notFound } from 'next/navigation';
import { getProposalById } from '@/lib/repositories/listen-repository';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getProposalEmpathyStatus } from '@/lib/repositories/proposal-empathy-repository';
import { getProposalComments } from '@/lib/repositories/proposal-comment-repository';
import ProposalDetailClient from './ProposalDetailClient';

interface ProposalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const { id: proposalId } = await params;
  const proposal = await getProposalById(proposalId);

  if (!proposal) {
    notFound();
  }

  const { user } = await getCurrentUser();
  const empathyState = await getProposalEmpathyStatus(proposalId);
  const comments = await getProposalComments(proposalId);

  return (
    <main className="ask-detail-container">
      <ProposalDetailClient
        proposal={proposal}
        currentUser={user}
        initialEmpathyState={empathyState}
        initialComments={comments}
      />
    </main>
  );
}
