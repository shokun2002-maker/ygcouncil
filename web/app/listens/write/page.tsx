import React from 'react';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getRegions } from '@/lib/repositories/region-repository';
import ProposalWriteClient from './ProposalWriteClient';

export default async function ListenWritePage() {
  const { user } = await getCurrentUser();
  const regions = await getRegions();

  return (
    <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '48px 24px 80px 24px', color: '#1D1D1F' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <ProposalWriteClient currentUser={user} regions={regions} />
      </div>
    </main>
  );
}
