export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ask_options: {
        Row: {
          ask_id: string
          created_at: string
          display_order: number
          id: string
          label: string
          tenant_id: string
        }
        Insert: {
          ask_id: string
          created_at?: string
          display_order?: number
          id?: string
          label: string
          tenant_id: string
        }
        Update: {
          ask_id?: string
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ask_option_ask_composite"
            columns: ["tenant_id", "ask_id"]
            isOneToOne: false
            referencedRelation: "asks"
            referencedColumns: ["tenant_id", "id"]
          },
        ]
      }
      ask_vote_choices: {
        Row: {
          ask_id: string
          created_at: string
          id: string
          option_id: string
          submission_id: string
          tenant_id: string
        }
        Insert: {
          ask_id: string
          created_at?: string
          id?: string
          option_id: string
          submission_id: string
          tenant_id: string
        }
        Update: {
          ask_id?: string
          created_at?: string
          id?: string
          option_id?: string
          submission_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_choice_option_composite"
            columns: ["tenant_id", "ask_id", "option_id"]
            isOneToOne: false
            referencedRelation: "ask_options"
            referencedColumns: ["tenant_id", "ask_id", "id"]
          },
          {
            foreignKeyName: "fk_choice_submission_composite"
            columns: ["tenant_id", "ask_id", "submission_id"]
            isOneToOne: false
            referencedRelation: "ask_vote_submissions"
            referencedColumns: ["tenant_id", "ask_id", "id"]
          },
        ]
      }
      ask_vote_submissions: {
        Row: {
          ask_id: string
          comment_text: string | null
          id: string
          opinion_text: string | null
          submitted_at: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          ask_id: string
          comment_text?: string | null
          id?: string
          opinion_text?: string | null
          submitted_at?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          ask_id?: string
          comment_text?: string | null
          id?: string
          opinion_text?: string | null
          submitted_at?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ask_vote_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_submission_ask_composite"
            columns: ["tenant_id", "ask_id"]
            isOneToOne: false
            referencedRelation: "asks"
            referencedColumns: ["tenant_id", "id"]
          },
        ]
      }
      asks: {
        Row: {
          allow_comment: boolean
          background: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          featured: boolean
          id: string
          max_select_count: number
          published_at: string | null
          region_id: string | null
          result_visibility: string
          start_at: string | null
          status: string
          summary: string
          survey_type: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          allow_comment?: boolean
          background?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          featured?: boolean
          id?: string
          max_select_count?: number
          published_at?: string | null
          region_id?: string | null
          result_visibility?: string
          start_at?: string | null
          status?: string
          summary: string
          survey_type: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          allow_comment?: boolean
          background?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          featured?: boolean
          id?: string
          max_select_count?: number
          published_at?: string | null
          region_id?: string | null
          result_visibility?: string
          start_at?: string | null
          status?: string
          summary?: string
          survey_type?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "asks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ask_region_composite"
            columns: ["tenant_id", "region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["tenant_id", "id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: string
          target_id: string | null
          target_table: string
          tenant_id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          target_id?: string | null
          target_table: string
          tenant_id: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          target_id?: string | null
          target_table?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      official_responses: {
        Row: {
          content: string
          department: string
          id: string
          is_current: boolean
          proposal_id: string
          responded_at: string
          responded_by: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          content: string
          department: string
          id?: string
          is_current?: boolean
          proposal_id: string
          responded_at?: string
          responded_by?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          department?: string
          id?: string
          is_current?: boolean
          proposal_id?: string
          responded_at?: string
          responded_by?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_response_proposal_composite"
            columns: ["tenant_id", "proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "official_responses_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      outcome_asks: {
        Row: {
          ask_id: string
          outcome_id: string
        }
        Insert: {
          ask_id: string
          outcome_id: string
        }
        Update: {
          ask_id?: string
          outcome_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcome_asks_ask_id_fkey"
            columns: ["ask_id"]
            isOneToOne: false
            referencedRelation: "asks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcome_asks_outcome_id_fkey"
            columns: ["outcome_id"]
            isOneToOne: false
            referencedRelation: "outcomes"
            referencedColumns: ["id"]
          },
        ]
      }
      outcome_proposals: {
        Row: {
          outcome_id: string
          proposal_id: string
        }
        Insert: {
          outcome_id: string
          proposal_id: string
        }
        Update: {
          outcome_id?: string
          proposal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcome_proposals_outcome_id_fkey"
            columns: ["outcome_id"]
            isOneToOne: false
            referencedRelation: "outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcome_proposals_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      outcome_steps: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label: string
          occurred_at: string | null
          outcome_id: string
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          label: string
          occurred_at?: string | null
          outcome_id: string
          status: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          occurred_at?: string | null
          outcome_id?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_step_outcome_composite"
            columns: ["tenant_id", "outcome_id"]
            isOneToOne: false
            referencedRelation: "outcomes"
            referencedColumns: ["tenant_id", "id"]
          },
        ]
      }
      outcomes: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          featured: boolean
          id: string
          outcome_at: string | null
          region_id: string | null
          result: string
          started_at: string | null
          status: string
          summary: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          featured?: boolean
          id?: string
          outcome_at?: string | null
          region_id?: string | null
          result: string
          started_at?: string | null
          status?: string
          summary: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          featured?: boolean
          id?: string
          outcome_at?: string | null
          region_id?: string | null
          result?: string
          started_at?: string | null
          status?: string
          summary?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_outcome_region_composite"
            columns: ["tenant_id", "region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "outcomes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "outcomes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      proposal_ask_links: {
        Row: {
          ask_id: string
          created_at: string
          created_by: string | null
          id: string
          link_type: string
          proposal_id: string
          tenant_id: string
        }
        Insert: {
          ask_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          link_type?: string
          proposal_id: string
          tenant_id: string
        }
        Update: {
          ask_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          link_type?: string
          proposal_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_link_ask_composite"
            columns: ["tenant_id", "ask_id"]
            isOneToOne: false
            referencedRelation: "asks"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "fk_link_proposal_composite"
            columns: ["tenant_id", "proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "proposal_ask_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      proposal_comments: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          hidden_at: string | null
          hidden_by: string | null
          id: string
          proposal_id: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          hidden_at?: string | null
          hidden_by?: string | null
          id?: string
          proposal_id: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          hidden_at?: string | null
          hidden_by?: string | null
          id?: string
          proposal_id?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_comment_proposal_composite"
            columns: ["tenant_id", "proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "proposal_comments_hidden_by_fkey"
            columns: ["hidden_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "proposal_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      proposal_empathy: {
        Row: {
          created_at: string
          id: string
          proposal_id: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          proposal_id: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          proposal_id?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_empathy_proposal_composite"
            columns: ["tenant_id", "proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "proposal_empathy_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      proposal_timeline: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          label: string
          occurred_at: string | null
          proposal_id: string
          status: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          label: string
          occurred_at?: string | null
          proposal_id: string
          status: string
          tenant_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          label?: string
          occurred_at?: string | null
          proposal_id?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_timeline_proposal_composite"
            columns: ["tenant_id", "proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "proposal_timeline_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      proposals: {
        Row: {
          category: string
          content: string
          created_at: string
          deleted_at: string | null
          featured: boolean
          id: string
          public_discussion_eligible: boolean
          region_id: string
          status: string
          summary: string
          tenant_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          deleted_at?: string | null
          featured?: boolean
          id?: string
          public_discussion_eligible?: boolean
          region_id: string
          status?: string
          summary: string
          tenant_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          deleted_at?: string | null
          featured?: boolean
          id?: string
          public_discussion_eligible?: boolean
          region_id?: string
          status?: string
          summary?: string
          tenant_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_proposal_region_composite"
            columns: ["tenant_id", "region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "proposals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      regions: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
          tenant_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          tenant_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "regions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      resident_verifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          identity_method: string | null
          identity_status: string
          identity_verified_at: string | null
          provider_subject_hash: string | null
          region_id: string | null
          residence_method: string | null
          residence_status: string
          residence_verified_at: string | null
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          identity_method?: string | null
          identity_status?: string
          identity_verified_at?: string | null
          provider_subject_hash?: string | null
          region_id?: string | null
          residence_method?: string | null
          residence_status?: string
          residence_verified_at?: string | null
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          identity_method?: string | null
          identity_status?: string
          identity_verified_at?: string | null
          provider_subject_hash?: string | null
          region_id?: string | null
          residence_method?: string | null
          residence_status?: string
          residence_verified_at?: string | null
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_verification_region_composite"
            columns: ["tenant_id", "region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["tenant_id", "id"]
          },
          {
            foreignKeyName: "resident_verifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resident_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tenant_memberships: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          role: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_outcome: {
        Args: {
          p_category: string
          p_content?: string
          p_region_id?: string
          p_result: string
          p_source_ask_id?: string
          p_source_proposal_id?: string
          p_status?: string
          p_summary: string
          p_tenant_id: string
          p_title: string
        }
        Returns: string
      }
      delete_my_proposal_comment: {
        Args: {
          p_comment_id: string
          p_tenant_id: string
        }
        Returns: boolean
      }
      demo_verify_identity: {
        Args: {
          p_tenant_id: string
        }
        Returns: Json
      }
      ensure_member_registration: {
        Args: {
          p_tenant_id: string
        }
        Returns: Json
      }
      get_ask_vote_results: {
        Args: {
          p_ask_id: string
          p_tenant_id: string
        }
        Returns: Json
      }
      get_proposal_comments: {
        Args: {
          p_proposal_id: string
          p_tenant_id: string
        }
        Returns: Json
      }
      get_proposal_empathy_status: {
        Args: {
          p_proposal_id: string
          p_tenant_id: string
        }
        Returns: Json
      }
      get_public_outcome_by_id: {
        Args: {
          p_outcome_id: string
          p_tenant_id: string
        }
        Returns: Json
      }
      get_public_outcomes: {
        Args: {
          p_tenant_id: string
        }
        Returns: Json
      }
      hide_proposal_comment: {
        Args: {
          p_comment_id: string
          p_reason?: string
          p_tenant_id: string
        }
        Returns: boolean
      }
      request_residence_verification: {
        Args: {
          p_region_id: string
          p_tenant_id: string
        }
        Returns: Json
      }
      submit_citizen_proposal: {
        Args: {
          p_category: string
          p_content: string
          p_region_id: string
          p_tenant_id: string
          p_title: string
        }
        Returns: string
      }
      submit_proposal_comment: {
        Args: {
          p_content: string
          p_proposal_id: string
          p_tenant_id: string
        }
        Returns: string
      }
      toggle_proposal_empathy: {
        Args: {
          p_proposal_id: string
          p_tenant_id: string
        }
        Returns: Json
      }
      update_outcome: {
        Args: {
          p_category: string
          p_content?: string
          p_outcome_id: string
          p_region_id?: string
          p_result: string
          p_source_ask_id?: string
          p_source_proposal_id?: string
          p_status?: string
          p_summary: string
          p_tenant_id: string
          p_title: string
        }
        Returns: boolean
      }
      review_residence_verification: {
        Args: {
          p_decision: string
          p_reason?: string
          p_target_user_id: string
          p_tenant_id: string
        }
        Returns: Json
      }
      submit_ask_vote: {
        Args: {
          p_ask_id: string
          p_comment_text?: string
          p_opinion_text?: string
          p_option_ids: string[]
          p_tenant_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
