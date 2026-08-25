import React from 'react';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getRegions } from '@/lib/repositories/region-repository';
import ProposalWriteClient from './ProposalWriteClient';

export default async function ListenWritePage() {
  const { user } = await getCurrentUser();
  const regions = await getRegions();

  return (
    <main className="ask-detail-container">
      <ProposalWriteClient currentUser={user} regions={regions} />
    </main>
  );
}
