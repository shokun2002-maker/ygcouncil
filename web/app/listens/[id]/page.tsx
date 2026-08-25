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
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '48px 24px 80px 24px', color: '#1D1D1F' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <ProposalDetailClient
          proposal={proposal}
          currentUser={user}
          initialEmpathyState={empathyState}
          initialComments={comments}
        />
      </div>
    </main>
  );
}
