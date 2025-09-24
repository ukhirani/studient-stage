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
      applications: {
        Row: {
          applied_at: string
          completed_at: string | null
          id: string
          interview_scheduled_at: string | null
          mentor_approved_at: string | null
          mentor_id: string | null
          notes: string | null
          offer_extended_at: string | null
          opportunity_id: string
          status: Database["public"]["Enums"]["application_status"] | null
          student_id: string
        }
        Insert: {
          applied_at?: string
          completed_at?: string | null
          id?: string
          interview_scheduled_at?: string | null
          mentor_approved_at?: string | null
          mentor_id?: string | null
          notes?: string | null
          offer_extended_at?: string | null
          opportunity_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id: string
        }
        Update: {
          applied_at?: string
          completed_at?: string | null
          id?: string
          interview_scheduled_at?: string | null
          mentor_approved_at?: string | null
          mentor_id?: string | null
          notes?: string | null
          offer_extended_at?: string | null
          opportunity_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_mentor"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_applications_opportunity"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_applications_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      certificates: {
        Row: {
          application_id: string
          certificate_url: string | null
          id: string
          issued_at: string
          student_id: string
        }
        Insert: {
          application_id: string
          certificate_url?: string | null
          id?: string
          issued_at?: string
          student_id: string
        }
        Update: {
          application_id?: string
          certificate_url?: string | null
          id?: string
          issued_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          application_id: string
          created_at: string
          feedback_text: string
          feedback_type: string | null
          given_by: string
          id: string
          rating: number | null
        }
        Insert: {
          application_id: string
          created_at?: string
          feedback_text: string
          feedback_type?: string | null
          given_by: string
          id?: string
          rating?: number | null
        }
        Update: {
          application_id?: string
          created_at?: string
          feedback_text?: string
          feedback_type?: string | null
          given_by?: string
          id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          company_name: string
          created_at: string
          deadline: string
          departments: string[] | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          min_cgpa: number | null
          placement_coordinator_id: string | null
          posted_by: string
          required_skills: string[] | null
          stipend_amount: number | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          deadline: string
          departments?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          min_cgpa?: number | null
          placement_coordinator_id?: string | null
          posted_by: string
          required_skills?: string[] | null
          stipend_amount?: number | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          deadline?: string
          departments?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          min_cgpa?: number | null
          placement_coordinator_id?: string | null
          posted_by?: string
          required_skills?: string[] | null
          stipend_amount?: number | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_opportunities_coordinator"
            columns: ["placement_coordinator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_opportunities_posted_by"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          contact_phone: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          year: number | null
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          year?: number | null
        }
        Update: {
          contact_phone?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          bio: string | null
          cgpa: number | null
          created_at: string
          github_url: string | null
          id: string
          linkedin_url: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
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
      application_status:
        | "pending"
        | "mentor_approved"
        | "interview_scheduled"
        | "offer_extended"
        | "rejected"
        | "completed"
      user_role:
        | "student"
        | "placement_officer"
        | "faculty_mentor"
        | "recruiter"
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
    Enums: {
      application_status: [
        "pending",
        "mentor_approved",
        "interview_scheduled",
        "offer_extended",
        "rejected",
        "completed",
      ],
      user_role: [
        "student",
        "placement_officer",
        "faculty_mentor",
        "recruiter",
      ],
    },
  },
} as const
