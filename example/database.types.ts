export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      todo_items: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
        };
      };
      profiles: {
        Row: {
          first_name: string | null;
          id: string;
          last_name: string | null;
        };
        Insert: {
          first_name?: string | null;
          id: string;
          last_name?: string | null;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_todos: {
        Args: {
          user_id: string;
        };
        Returns: {
          id: string;
          name: string;
          description: string;
          created_at: string;
        }[];
      };
      search_todos: {
        Args: {
          search_term: string;
          limit_count?: number;
        };
        Returns: {
          id: string;
          name: string;
          description: string;
        }[];
      };
    };
    Enums: {
      todo_status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      priority_level: 'low' | 'medium' | 'high' | 'urgent';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
