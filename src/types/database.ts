export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          school_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          school_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          school_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          teacher_id: string
          name: string
          subject: string
          grade_level: string
          academic_year: string
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          name: string
          subject: string
          grade_level: string
          academic_year?: string
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          name?: string
          subject?: string
          grade_level?: string
          academic_year?: string
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          teacher_id: string
          full_name: string
          student_code: string | null
          notes: string | null
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          full_name: string
          student_code?: string | null
          notes?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          full_name?: string
          student_code?: string | null
          notes?: string | null
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      class_enrollments: {
        Row: {
          id: string
          class_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          enrolled_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          teacher_id: string
          class_id: string
          activity_id: string
          activity_snapshot: Json
          status: 'draft' | 'in_progress' | 'completed' | 'cancelled'
          grouping_strategy: 'balanced' | 'random' | 'manual'
          current_step_index: number
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          class_id: string
          activity_id: string
          activity_snapshot?: Json
          status?: 'draft' | 'in_progress' | 'completed' | 'cancelled'
          grouping_strategy?: 'balanced' | 'random' | 'manual'
          current_step_index?: number
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          class_id?: string
          activity_id?: string
          activity_snapshot?: Json
          status?: 'draft' | 'in_progress' | 'completed' | 'cancelled'
          grouping_strategy?: 'balanced' | 'random' | 'manual'
          current_step_index?: number
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      session_participants: {
        Row: {
          id: string
          session_id: string
          student_id: string
          is_present: boolean
        }
        Insert: {
          id?: string
          session_id: string
          student_id: string
          is_present?: boolean
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          is_present?: boolean
        }
      }
      session_groups: {
        Row: {
          id: string
          session_id: string
          group_number: number
          group_name: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          group_number: number
          group_name: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          group_number?: number
          group_name?: string
          created_at?: string
        }
      }
      session_group_members: {
        Row: {
          id: string
          group_id: string
          participant_id: string
          role_title: string | null
          role_description: string | null
        }
        Insert: {
          id?: string
          group_id: string
          participant_id: string
          role_title?: string | null
          role_description?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          participant_id?: string
          role_title?: string | null
          role_description?: string | null
        }
      }
      session_responses: {
        Row: {
          id: string
          session_id: string
          group_id: string | null
          step_id: string
          response_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          group_id?: string | null
          step_id: string
          response_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          group_id?: string | null
          step_id?: string
          response_data?: Json
          created_at?: string
        }
      }
      student_competency_observations: {
        Row: {
          id: string
          teacher_id: string
          student_id: string
          session_id: string | null
          competency_id: string
          level: number | null
          evidence_note: string | null
          observed_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          student_id: string
          session_id?: string | null
          competency_id: string
          level?: number | null
          evidence_note?: string | null
          observed_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          student_id?: string
          session_id?: string | null
          competency_id?: string
          level?: number | null
          evidence_note?: string | null
          observed_at?: string
        }
      }
      session_assessments: {
        Row: {
          id: string
          session_id: string
          group_id: string | null
          understanding_level: number | null
          collaboration_quality: number | null
          teacher_reflection: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          group_id?: string | null
          understanding_level?: number | null
          collaboration_quality?: number | null
          teacher_reflection?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          group_id?: string | null
          understanding_level?: number | null
          collaboration_quality?: number | null
          teacher_reflection?: string | null
          created_at?: string
        }
      }
    }
  }
}
