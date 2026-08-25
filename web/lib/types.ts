export interface AskOption {
  id: string;
  label: string;
  votes: number;
}

export interface Ask {
  id: string;
  category: string;
  title: string;
  summary: string;
  description: string;
  background?: string;
  status: 'active' | 'closed' | 'draft';
  statusText: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  surveyType: 'yes-no' | 'single' | 'multiple' | 'opinion';
  options: AskOption[];
  maxSelectCount?: number;
  allowComment?: boolean;
  region: string;
  featured?: boolean;
  resultVisibility?: 'after-vote' | 'always' | 'after-close';
}

export interface ProposalTimeline {
  step: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

export interface OfficialResponse {
  department: string;
  date: string;
  content: string;
}

export interface ProposalComment {
  commentId: string;
  authorDisplay: string;
  text: string;
  createdAt: string;
  isLocalUser?: boolean;
}

export interface Proposal {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  region: string;
  createdAt: string;
  status: string;
  statusText: string;
  empathyCount: number;
  commentCount: number;
  viewCount: number;
  authorDisplay: string;
  timeline: ProposalTimeline[];
  adminResponse?: OfficialResponse;
  relatedAskId?: string;
  publicDiscussionEligible?: boolean;
  featured?: boolean;
  isDemo?: boolean;
  isLocalUserCreated?: boolean;
}

export interface OutcomeStep {
  label: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Outcome {
  id: string;
  title: string;
  summary: string;
  category: string;
  region: string;
  status: 'completed' | 'active';
  statusText: string;
  sourceType: 'listen' | 'ask' | 'listen-to-ask';
  sourceListenId?: string | null;
  sourceAskId?: string | null;
  startedAt: string;
  updatedAt: string;
  outcomeDate: string;
  steps: OutcomeStep[];
  result: string;
  featured?: boolean;
  isDemo?: boolean;
}
