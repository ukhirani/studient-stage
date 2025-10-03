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
          cover_letter: string | null
          current_round: number | null
          id: string
          mentor_approved_at: string | null
          mentor_comments: string | null
          mentor_id: string | null
          opportunity_id: string
          shortlisted_at: string | null
          shortlisted_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          current_round?: number | null
          id?: string
          mentor_approved_at?: string | null
          mentor_comments?: string | null
          mentor_id?: string | null
          opportunity_id: string
          shortlisted_at?: string | null
          shortlisted_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          current_round?: number | null
          id?: string
          mentor_approved_at?: string | null
          mentor_comments?: string | null
          mentor_id?: string | null
          opportunity_id?: string
          shortlisted_at?: string | null
          shortlisted_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      career_log: {
        Row: {
          application_id: string | null
          certificate_id: string | null
          company_id: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          placement_eligible: boolean | null
          start_date: string | null
          status: string
          student_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          certificate_id?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          placement_eligible?: boolean | null
          start_date?: string | null
          status: string
          student_id: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          certificate_id?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          placement_eligible?: boolean | null
          start_date?: string | null
          status?: string
          student_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_log_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_log_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          application_id: string | null
          certificate_type: string
          certificate_url: string | null
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          issue_date: string
          issued_by: string | null
          student_id: string
          title: string
          updated_at: string
        }
        Insert: {
          application_id?: string | null
          certificate_type: string
          certificate_url?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          issue_date: string
          issued_by?: string | null
          student_id: string
          title: string
          updated_at?: string
        }
        Update: {
          application_id?: string | null
          certificate_type?: string
          certificate_url?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          student_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          application_id: string
          areas_for_improvement: string | null
          comments: string | null
          communication_rating: number | null
          created_at: string
          given_by: string
          id: string
          professionalism_rating: number | null
          rating: number | null
          strengths: string | null
          student_id: string
          technical_skills_rating: number | null
          updated_at: string
          would_hire_again: boolean | null
        }
        Insert: {
          application_id: string
          areas_for_improvement?: string | null
          comments?: string | null
          communication_rating?: number | null
          created_at?: string
          given_by: string
          id?: string
          professionalism_rating?: number | null
          rating?: number | null
          strengths?: string | null
          student_id: string
          technical_skills_rating?: number | null
          updated_at?: string
          would_hire_again?: boolean | null
        }
        Update: {
          application_id?: string
          areas_for_improvement?: string | null
          comments?: string | null
          communication_rating?: number | null
          created_at?: string
          given_by?: string
          id?: string
          professionalism_rating?: number | null
          rating?: number | null
          strengths?: string | null
          student_id?: string
          technical_skills_rating?: number | null
          updated_at?: string
          would_hire_again?: boolean | null
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
      interviews: {
        Row: {
          application_id: string
          created_at: string
          created_by: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          location: string | null
          meeting_link: string | null
          mode: string | null
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          created_by: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          mode?: string | null
          notes?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          created_by?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          mode?: string | null
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_student_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          is_active: boolean
          mentor_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          mentor_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          mentor_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      offer_letters: {
        Row: {
          application_id: string
          company_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          issued_at: string
          issued_by: string | null
          joining_date: string | null
          offer_letter_url: string | null
          offer_type: string
          position: string
          salary_amount: number | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          application_id: string
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          joining_date?: string | null
          offer_letter_url?: string | null
          offer_type: string
          position: string
          salary_amount?: number | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          application_id?: string
          company_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          joining_date?: string | null
          offer_letter_url?: string | null
          offer_type?: string
          position?: string
          salary_amount?: number | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offer_letters_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_letters_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          company_id: string | null
          company_name: string
          created_at: string
          deadline: string | null
          departments: string[] | null
          description: string
          id: string
          interview_rounds: Json | null
          is_active: boolean
          location: string | null
          min_cgpa: number | null
          posted_by: string
          required_skills: string[] | null
          stipend_amount: number | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          company_name: string
          created_at?: string
          deadline?: string | null
          departments?: string[] | null
          description: string
          id?: string
          interview_rounds?: Json | null
          is_active?: boolean
          location?: string | null
          min_cgpa?: number | null
          posted_by: string
          required_skills?: string[] | null
          stipend_amount?: number | null
          title: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          company_name?: string
          created_at?: string
          deadline?: string | null
          departments?: string[] | null
          description?: string
          id?: string
          interview_rounds?: Json | null
          is_active?: boolean
          location?: string | null
          min_cgpa?: number | null
          posted_by?: string
          required_skills?: string[] | null
          stipend_amount?: number | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          industry: string | null
          is_verified: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recruiter_profiles: {
        Row: {
          company_id: string | null
          created_at: string
          department: string | null
          id: string
          is_verified: boolean
          position: string | null
          updated_at: string
          user_id: string
          verification_document_url: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_verified?: boolean
          position?: string | null
          updated_at?: string
          user_id: string
          verification_document_url?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_verified?: boolean
          position?: string | null
          updated_at?: string
          user_id?: string
          verification_document_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          bio: string | null
          cgpa: number | null
          created_at: string
          department: string | null
          id: string
          resume_url: string | null
          roll_number: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
          year_of_study: number | null
        }
        Insert: {
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          department?: string | null
          id?: string
          resume_url?: string | null
          roll_number?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          year_of_study?: number | null
        }
        Update: {
          bio?: string | null
          cgpa?: number | null
          created_at?: string
          department?: string | null
          id?: string
          resume_url?: string | null
          roll_number?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          year_of_study?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_verified_recruiter: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "pending"
        | "under_review"
        | "shortlisted"
        | "selected"
        | "rejected"
        | "mentor_pending"
        | "mentor_approved"
        | "mentor_rejected"
        | "interview_scheduled"
        | "offer_extended"
        | "offer_accepted"
        | "offer_rejected"
        | "placed"
        | "internship_ongoing"
        | "internship_completed"
      opportunity_type: "internship" | "full_time" | "part_time" | "placement"
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
        "under_review",
        "shortlisted",
        "selected",
        "rejected",
        "mentor_pending",
        "mentor_approved",
        "mentor_rejected",
        "interview_scheduled",
        "offer_extended",
        "offer_accepted",
        "offer_rejected",
        "placed",
        "internship_ongoing",
        "internship_completed",
      ],
      opportunity_type: ["internship", "full_time", "part_time", "placement"],
      user_role: [
        "student",
        "placement_officer",
        "faculty_mentor",
        "recruiter",
      ],
    },
  },
} as const
