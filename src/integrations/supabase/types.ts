export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
          id: string
          opportunity_id: string
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at: string
          mentor_id: string | null
          mentor_approved_at: string | null
          mentor_comments: string | null
          shortlisted_at: string | null
          shortlisted_by: string | null
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          opportunity_id: string
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at?: string
          mentor_id?: string | null
          mentor_approved_at?: string | null
          mentor_comments?: string | null
          shortlisted_at?: string | null
          shortlisted_by?: string | null
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          opportunity_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          updated_at?: string
          mentor_id?: string | null
          mentor_approved_at?: string | null
          mentor_comments?: string | null
          shortlisted_at?: string | null
          shortlisted_by?: string | null
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
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          website: string | null
          industry: string | null
          logo_url: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          status: Database["public"]["Enums"]["company_status"]
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          website?: string | null
          industry?: string | null
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          website?: string | null
          industry?: string | null
          logo_url?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      recruiter_profiles: {
        Row: {
          id: string
          user_id: string
          company_id: string | null
          position: string | null
          department: string | null
          is_verified: boolean
          verification_document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id?: string | null
          position?: string | null
          department?: string | null
          is_verified?: boolean
          verification_document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string | null
          position?: string | null
          department?: string | null
          is_verified?: boolean
          verification_document_url?: string | null
          created_at?: string
          updated_at?: string
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
      mentor_student_assignments: {
        Row: {
          id: string
          mentor_id: string
          student_id: string
          assigned_at: string
          assigned_by: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mentor_id: string
          student_id: string
          assigned_at?: string
          assigned_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mentor_id?: string
          student_id?: string
          assigned_at?: string
          assigned_by?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          id: string
          application_id: string
          scheduled_date: string
          scheduled_time: string
          duration_minutes: number | null
          mode: Database["public"]["Enums"]["interview_mode"] | null
          location: string | null
          meeting_link: string | null
          status: Database["public"]["Enums"]["interview_status"]
          notes: string | null
          feedback: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          scheduled_date: string
          scheduled_time: string
          duration_minutes?: number | null
          mode?: Database["public"]["Enums"]["interview_mode"] | null
          location?: string | null
          meeting_link?: string | null
          status?: Database["public"]["Enums"]["interview_status"]
          notes?: string | null
          feedback?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          scheduled_date?: string
          scheduled_time?: string
          duration_minutes?: number | null
          mode?: Database["public"]["Enums"]["interview_mode"] | null
          location?: string | null
          meeting_link?: string | null
          status?: Database["public"]["Enums"]["interview_status"]
          notes?: string | null
          feedback?: string | null
          created_by?: string
          created_at?: string
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
      certificates: {
        Row: {
          id: string
          student_id: string
          application_id: string | null
          company_id: string | null
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          title: string
          description: string | null
          issue_date: string
          certificate_url: string | null
          issued_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          application_id?: string | null
          company_id?: string | null
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          title: string
          description?: string | null
          issue_date: string
          certificate_url?: string | null
          issued_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          application_id?: string | null
          company_id?: string | null
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          title?: string
          description?: string | null
          issue_date?: string
          certificate_url?: string | null
          issued_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      career_log: {
        Row: {
          id: string
          student_id: string
          application_id: string | null
          company_id: string | null
          type: Database["public"]["Enums"]["career_log_type"]
          title: string
          description: string | null
          start_date: string | null
          end_date: string | null
          status: Database["public"]["Enums"]["career_log_status"]
          placement_eligible: boolean
          certificate_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          application_id?: string | null
          company_id?: string | null
          type: Database["public"]["Enums"]["career_log_type"]
          title: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status: Database["public"]["Enums"]["career_log_status"]
          placement_eligible?: boolean
          certificate_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          application_id?: string | null
          company_id?: string | null
          type?: Database["public"]["Enums"]["career_log_type"]
          title?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: Database["public"]["Enums"]["career_log_status"]
          placement_eligible?: boolean
          certificate_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_log_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          id: string
          application_id: string
          student_id: string
          given_by: string
          rating: number | null
          technical_skills_rating: number | null
          communication_rating: number | null
          professionalism_rating: number | null
          comments: string | null
          strengths: string | null
          areas_for_improvement: string | null
          would_hire_again: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          student_id: string
          given_by: string
          rating?: number | null
          technical_skills_rating?: number | null
          communication_rating?: number | null
          professionalism_rating?: number | null
          comments?: string | null
          strengths?: string | null
          areas_for_improvement?: string | null
          would_hire_again?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          student_id?: string
          given_by?: string
          rating?: number | null
          technical_skills_rating?: number | null
          communication_rating?: number | null
          professionalism_rating?: number | null
          comments?: string | null
          strengths?: string | null
          areas_for_improvement?: string | null
          would_hire_again?: boolean | null
          created_at?: string
          updated_at?: string
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
      offer_letters: {
        Row: {
          id: string
          application_id: string
          student_id: string
          company_id: string | null
          offer_type: Database["public"]["Enums"]["offer_type"]
          position: string
          salary_amount: number | null
          joining_date: string | null
          offer_letter_url: string | null
          status: Database["public"]["Enums"]["offer_status"]
          issued_by: string | null
          issued_at: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          student_id: string
          company_id?: string | null
          offer_type: Database["public"]["Enums"]["offer_type"]
          position: string
          salary_amount?: number | null
          joining_date?: string | null
          offer_letter_url?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          issued_by?: string | null
          issued_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          student_id?: string
          company_id?: string | null
          offer_type?: Database["public"]["Enums"]["offer_type"]
          position?: string
          salary_amount?: number | null
          joining_date?: string | null
          offer_letter_url?: string | null
          status?: Database["public"]["Enums"]["offer_status"]
          issued_by?: string | null
          issued_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
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
          company_name: string
          created_at: string
          deadline: string | null
          departments: string[] | null
          description: string
          id: string
          is_active: boolean
          location: string | null
          min_cgpa: number | null
          posted_by: string
          required_skills: string[] | null
          stipend_amount: number | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at: string
          company_id: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          deadline?: string | null
          departments?: string[] | null
          description: string
          id?: string
          is_active?: boolean
          location?: string | null
          min_cgpa?: number | null
          posted_by: string
          required_skills?: string[] | null
          stipend_amount?: number | null
          title: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
          company_id?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          deadline?: string | null
          departments?: string[] | null
          description?: string
          id?: string
          is_active?: boolean
          location?: string | null
          min_cgpa?: number | null
          posted_by?: string
          required_skills?: string[] | null
          stipend_amount?: number | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
          company_id?: string | null
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
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    }
    Enums: {
      application_status:
        | "pending"
        | "under_review"
        | "mentor_pending"
        | "mentor_approved"
        | "mentor_rejected"
        | "shortlisted"
        | "interview_scheduled"
        | "selected"
        | "rejected"
        | "offer_extended"
        | "offer_accepted"
        | "offer_rejected"
        | "placed"
        | "internship_ongoing"
        | "internship_completed"
      company_status: "pending" | "verified" | "rejected"
      interview_mode: "online" | "offline" | "phone"
      interview_status: "scheduled" | "confirmed" | "completed" | "cancelled" | "rescheduled"
      certificate_type: "internship" | "placement" | "training" | "achievement"
      career_log_type: "internship" | "placement" | "training" | "achievement"
      career_log_status: "ongoing" | "completed" | "cancelled"
      offer_type: "internship" | "full_time" | "part_time" | "ppo"
      offer_status: "pending" | "accepted" | "rejected" | "expired"
      opportunity_type: "internship" | "full_time" | "part_time" | "placement"
      user_role: "student" | "placement_officer" | "faculty_mentor" | "recruiter"
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
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
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
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
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
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
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
        "mentor_pending",
        "mentor_approved",
        "mentor_rejected",
        "shortlisted",
        "interview_scheduled",
        "selected",
        "rejected",
        "offer_extended",
        "offer_accepted",
        "offer_rejected",
        "placed",
        "internship_ongoing",
        "internship_completed",
      ],
      company_status: ["pending", "verified", "rejected"],
      interview_mode: ["online", "offline", "phone"],
      interview_status: ["scheduled", "confirmed", "completed", "cancelled", "rescheduled"],
      certificate_type: ["internship", "placement", "training", "achievement"],
      career_log_type: ["internship", "placement", "training", "achievement"],
      career_log_status: ["ongoing", "completed", "cancelled"],
      offer_type: ["internship", "full_time", "part_time", "ppo"],
      offer_status: ["pending", "accepted", "rejected", "expired"],
      opportunity_type: ["internship", "full_time", "part_time", "placement"],
      user_role: ["student", "placement_officer", "faculty_mentor", "recruiter"],
    },
  },
} as const
