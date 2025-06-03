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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          day: string
          reps: number | null
          image: string | null
          date: string
          created_at: string
          updated_at: string
          is_template: boolean
          muscle_groups: string[]
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          day: string
          reps?: number | null
          image?: string | null
          date?: string
          created_at?: string
          updated_at?: string
          is_template?: boolean
          muscle_groups?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          day?: string
          reps?: number | null
          image?: string | null
          date?: string
          created_at?: string
          updated_at?: string
          is_template?: boolean
          muscle_groups?: string[]
        }
      }
      exercises: {
        Row: {
          id: string
          workout_id: string
          name: string
          weights: number[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          name: string
          weights?: number[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          name?: string
          weights?: number[]
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories: number
          time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          calories?: number
          time?: string
          created_at?: string
          updated_at?: string
        }
      }
      weight_logs: {
        Row: {
          id: string
          user_id: string
          value: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          value: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          value?: number
          date?: string
          created_at?: string
        }
      }
      supplements: {
        Row: {
          id: string
          name: string
          shop: string | null
          price: number | null
          image: string | null
          tag: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          shop?: string | null
          price?: number | null
          image?: string | null
          tag?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          shop?: string | null
          price?: number | null
          image?: string | null
          tag?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: 'beginner' | 'intermediate' | 'advanced'
    }
  }
}