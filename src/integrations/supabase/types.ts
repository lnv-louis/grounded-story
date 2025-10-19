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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          created_at: string | null
          headline: string
          id: string
          query: string
          topic: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          headline: string
          id?: string
          query: string
          topic?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          headline?: string
          id?: string
          query?: string
          topic?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      citations: {
        Row: {
          claim_id: string | null
          created_at: string | null
          excerpt: string
          id: string
          page_number: string | null
          rationale: string | null
          source_id: string | null
        }
        Insert: {
          claim_id?: string | null
          created_at?: string | null
          excerpt: string
          id?: string
          page_number?: string | null
          rationale?: string | null
          source_id?: string | null
        }
        Update: {
          claim_id?: string | null
          created_at?: string | null
          excerpt?: string
          id?: string
          page_number?: string | null
          rationale?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citations_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          article_id: string | null
          claim_text: string
          confidence: number | null
          created_at: string | null
          id: string
          position: number | null
        }
        Insert: {
          article_id?: string | null
          claim_text: string
          confidence?: number | null
          created_at?: string | null
          id?: string
          position?: number | null
        }
        Update: {
          article_id?: string | null
          claim_text?: string
          confidence?: number | null
          created_at?: string | null
          id?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      graph_edges: {
        Row: {
          article_id: string | null
          created_at: string | null
          edge_type: string | null
          id: string
          source_node: string | null
          target_node: string | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string | null
          edge_type?: string | null
          id?: string
          source_node?: string | null
          target_node?: string | null
        }
        Update: {
          article_id?: string | null
          created_at?: string | null
          edge_type?: string | null
          id?: string
          source_node?: string | null
          target_node?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "graph_edges_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graph_edges_source_node_fkey"
            columns: ["source_node"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graph_edges_target_node_fkey"
            columns: ["target_node"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          article_id: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          spectrum_coverage: string | null
          transparency_score: number | null
        }
        Insert: {
          article_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          spectrum_coverage?: string | null
          transparency_score?: number | null
        }
        Update: {
          article_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          spectrum_coverage?: string | null
          transparency_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          article_id: string | null
          created_at: string | null
          id: string
          outlet_name: string
          political_lean: string | null
          publish_date: string | null
          source_type: string | null
          url: string
        }
        Insert: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          outlet_name: string
          political_lean?: string | null
          publish_date?: string | null
          source_type?: string | null
          url: string
        }
        Update: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          outlet_name?: string
          political_lean?: string | null
          publish_date?: string | null
          source_type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "sources_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          analysis_data: Json
          created_at: string
          headline: string | null
          id: string
          query: string
          summary: string | null
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data: Json
          created_at?: string
          headline?: string | null
          id?: string
          query: string
          summary?: string | null
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          headline?: string | null
          id?: string
          query?: string
          summary?: string | null
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
