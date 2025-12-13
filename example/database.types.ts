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
      appointment_service: {
        Row: {
          appointment_id: string;
          created_at: string | null;
          id: string;
          service_id: string;
        };
        Insert: {
          appointment_id: string;
          created_at?: string | null;
          id?: string;
          service_id: string;
        };
        Update: {
          appointment_id?: string;
          created_at?: string | null;
          id?: string;
          service_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'appointment_service_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointment_service_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          }
        ];
      };
      appointments: {
        Row: {
          company_id: string;
          created_at: string | null;
          customer_id: string | null;
          date: string;
          duration_seconds: number;
          employee_id: string | null;
          end_time: string;
          id: string;
          note: string | null;
          start_time: string;
          status: Database['public']['Enums']['appointment_status'];
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          customer_id?: string | null;
          date: string;
          duration_seconds: number;
          employee_id?: string | null;
          end_time: string;
          id?: string;
          note?: string | null;
          start_time: string;
          status?: Database['public']['Enums']['appointment_status'];
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          customer_id?: string | null;
          date?: string;
          duration_seconds?: number;
          employee_id?: string | null;
          end_time?: string;
          id?: string;
          note?: string | null;
          start_time?: string;
          status?: Database['public']['Enums']['appointment_status'];
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'appointments_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointments_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'appointments_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'appointments_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      assistant_assignments: {
        Row: {
          assistant_member_id: string;
          created_at: string | null;
          id: string;
          target_member_id: string;
        };
        Insert: {
          assistant_member_id: string;
          created_at?: string | null;
          id?: string;
          target_member_id: string;
        };
        Update: {
          assistant_member_id?: string;
          created_at?: string | null;
          id?: string;
          target_member_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'assistant_assignments_assistant_member_id_fkey';
            columns: ['assistant_member_id'];
            isOneToOne: false;
            referencedRelation: 'organization_members';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'assistant_assignments_target_member_id_fkey';
            columns: ['target_member_id'];
            isOneToOne: false;
            referencedRelation: 'organization_members';
            referencedColumns: ['id'];
          }
        ];
      };
      attachments: {
        Row: {
          company_id: string | null;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          file_extension: string | null;
          file_name: string | null;
          file_path: string;
          file_size: number | null;
          file_type: string;
          id: string;
          is_public: boolean;
          metadata: Json | null;
          record_id: string;
          record_type: Database['public']['Enums']['attachment_record_type'];
          updated_at: string | null;
        };
        Insert: {
          company_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          file_extension?: string | null;
          file_name?: string | null;
          file_path: string;
          file_size?: number | null;
          file_type: string;
          id?: string;
          is_public?: boolean;
          metadata?: Json | null;
          record_id: string;
          record_type: Database['public']['Enums']['attachment_record_type'];
          updated_at?: string | null;
        };
        Update: {
          company_id?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          file_extension?: string | null;
          file_name?: string | null;
          file_path?: string;
          file_size?: number | null;
          file_type?: string;
          id?: string;
          is_public?: boolean;
          metadata?: Json | null;
          record_id?: string;
          record_type?: Database['public']['Enums']['attachment_record_type'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'attachments_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attachments_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'attachments_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      audit_logs: {
        Row: {
          action: Database['public']['Enums']['audit_action'];
          actor_id: string | null;
          company_id: string | null;
          created_at: string | null;
          id: string;
          ip_address: unknown;
          metadata: Json | null;
          new_values: Json | null;
          old_values: Json | null;
          record_id: string | null;
          table_name: string;
          user_agent: string | null;
        };
        Insert: {
          action: Database['public']['Enums']['audit_action'];
          actor_id?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name: string;
          user_agent?: string | null;
        };
        Update: {
          action?: Database['public']['Enums']['audit_action'];
          actor_id?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          new_values?: Json | null;
          old_values?: Json | null;
          record_id?: string | null;
          table_name?: string;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_logs_actor_id_fkey';
            columns: ['actor_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'audit_logs_actor_id_fkey';
            columns: ['actor_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audit_logs_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      companies: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          owner_id: string;
          parent_id: string | null;
          slug: string | null;
          tax_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          owner_id: string;
          parent_id?: string | null;
          slug?: string | null;
          tax_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          owner_id?: string;
          parent_id?: string | null;
          slug?: string | null;
          tax_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'companies_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'companies_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'companies_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      company_meta: {
        Row: {
          company_id: string;
          created_at: string | null;
          id: string;
          meta_key: string;
          meta_value: string | null;
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          id?: string;
          meta_key: string;
          meta_value?: string | null;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          id?: string;
          meta_key?: string;
          meta_value?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'company_meta_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
      customer_company_relations: {
        Row: {
          company_id: string;
          customer_id: string;
          id: string;
        };
        Insert: {
          company_id: string;
          customer_id: string;
          id?: string;
        };
        Update: {
          company_id?: string;
          customer_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'customer_company_relations_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'customer_company_relations_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          }
        ];
      };
      customers: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          birth_date: string | null;
          created_at: string | null;
          email: string | null;
          first_name: string | null;
          gender: string | null;
          id: string;
          last_name: string | null;
          notes: string | null;
          phone: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: string;
          last_name?: string | null;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          birth_date?: string | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          gender?: string | null;
          id?: string;
          last_name?: string | null;
          notes?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      employee_service_relations: {
        Row: {
          company_id: string;
          created_at: string | null;
          employee_id: string | null;
          id: string;
          is_active: boolean | null;
          service_id: string;
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          employee_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          service_id: string;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          employee_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          service_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'employee_service_relations_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'employee_service_relations_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'employee_service_relations_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'employee_service_relations_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          }
        ];
      };
      employee_working_leave: {
        Row: {
          company_id: string;
          created_at: string | null;
          date: string;
          duration_seconds: number;
          employee_id: string;
          end_time: string;
          id: string;
          note: string | null;
          start_time: string;
          status: string;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          date: string;
          duration_seconds: number;
          employee_id: string;
          end_time: string;
          id?: string;
          note?: string | null;
          start_time: string;
          status?: string;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          date?: string;
          duration_seconds?: number;
          employee_id?: string;
          end_time?: string;
          id?: string;
          note?: string | null;
          start_time?: string;
          status?: string;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'employee_working_leave_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'employee_working_leave_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'employee_working_leave_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      invoices: {
        Row: {
          appointment_id: string | null;
          company_id: string;
          created_at: string | null;
          currency: Database['public']['Enums']['currency'];
          customer_id: string;
          discount_amount: number | null;
          due_date: string | null;
          employee_id: string | null;
          id: string;
          invoice_number: string;
          invoice_type: Database['public']['Enums']['invoice_type'];
          issue_date: string;
          status: Database['public']['Enums']['invoice_status'];
          subtotal: number;
          tax_amount: number | null;
          tax_rate: number;
          total_amount: number;
          updated_at: string | null;
        };
        Insert: {
          appointment_id?: string | null;
          company_id: string;
          created_at?: string | null;
          currency?: Database['public']['Enums']['currency'];
          customer_id: string;
          discount_amount?: number | null;
          due_date?: string | null;
          employee_id?: string | null;
          id?: string;
          invoice_number: string;
          invoice_type?: Database['public']['Enums']['invoice_type'];
          issue_date?: string;
          status?: Database['public']['Enums']['invoice_status'];
          subtotal: number;
          tax_amount?: number | null;
          tax_rate: number;
          total_amount: number;
          updated_at?: string | null;
        };
        Update: {
          appointment_id?: string | null;
          company_id?: string;
          created_at?: string | null;
          currency?: Database['public']['Enums']['currency'];
          customer_id?: string;
          discount_amount?: number | null;
          due_date?: string | null;
          employee_id?: string | null;
          id?: string;
          invoice_number?: string;
          invoice_type?: Database['public']['Enums']['invoice_type'];
          issue_date?: string;
          status?: Database['public']['Enums']['invoice_status'];
          subtotal?: number;
          tax_amount?: number | null;
          tax_rate?: number;
          total_amount?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'invoices_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'invoices_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      invoices_meta: {
        Row: {
          id: string;
          invoice_id: string;
          meta_key: string;
          meta_value: string | null;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          meta_key: string;
          meta_value?: string | null;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          meta_key?: string;
          meta_value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_meta_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          }
        ];
      };
      notifications: {
        Row: {
          company_id: string | null;
          created_at: string | null;
          customer_id: string | null;
          id: string;
          is_read: boolean | null;
          message: string | null;
          metadata: Json | null;
          read_at: string | null;
          related_id: string | null;
          related_type: string | null;
          title: string;
          type: Database['public']['Enums']['notification_type'];
          user_id: string | null;
        };
        Insert: {
          company_id?: string | null;
          created_at?: string | null;
          customer_id?: string | null;
          id?: string;
          is_read?: boolean | null;
          message?: string | null;
          metadata?: Json | null;
          read_at?: string | null;
          related_id?: string | null;
          related_type?: string | null;
          title: string;
          type: Database['public']['Enums']['notification_type'];
          user_id?: string | null;
        };
        Update: {
          company_id?: string | null;
          created_at?: string | null;
          customer_id?: string | null;
          id?: string;
          is_read?: boolean | null;
          message?: string | null;
          metadata?: Json | null;
          read_at?: string | null;
          related_id?: string | null;
          related_type?: string | null;
          title?: string;
          type?: Database['public']['Enums']['notification_type'];
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      organization_invites: {
        Row: {
          accepted_at: string | null;
          cancelled_at: string | null;
          company_id: string;
          created_at: string | null;
          email: string | null;
          expires_at: string | null;
          id: string;
          invite_code: string;
          invited_by: string;
          metadata: Json | null;
          phone: string | null;
          rejected_at: string | null;
          role: Database['public']['Enums']['app_role'];
          status: Database['public']['Enums']['invite_status'];
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          accepted_at?: string | null;
          cancelled_at?: string | null;
          company_id: string;
          created_at?: string | null;
          email?: string | null;
          expires_at?: string | null;
          id?: string;
          invite_code: string;
          invited_by: string;
          metadata?: Json | null;
          phone?: string | null;
          rejected_at?: string | null;
          role: Database['public']['Enums']['app_role'];
          status?: Database['public']['Enums']['invite_status'];
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          accepted_at?: string | null;
          cancelled_at?: string | null;
          company_id?: string;
          created_at?: string | null;
          email?: string | null;
          expires_at?: string | null;
          id?: string;
          invite_code?: string;
          invited_by?: string;
          metadata?: Json | null;
          phone?: string | null;
          rejected_at?: string | null;
          role?: Database['public']['Enums']['app_role'];
          status?: Database['public']['Enums']['invite_status'];
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_invites_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organization_invites_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'organization_invites_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organization_invites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'organization_invites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      organization_members: {
        Row: {
          company_id: string;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          role: Database['public']['Enums']['app_role'];
          user_id: string;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          role?: Database['public']['Enums']['app_role'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_members_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organization_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'organization_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      payments: {
        Row: {
          amount: number;
          appointment_id: string | null;
          company_id: string;
          created_at: string | null;
          currency: Database['public']['Enums']['currency'];
          customer_id: string;
          employee_id: string | null;
          id: string;
          invoice_id: string | null;
          method: Database['public']['Enums']['payment_method'];
          status: Database['public']['Enums']['payment_status'];
          updated_at: string | null;
        };
        Insert: {
          amount: number;
          appointment_id?: string | null;
          company_id: string;
          created_at?: string | null;
          currency?: Database['public']['Enums']['currency'];
          customer_id: string;
          employee_id?: string | null;
          id?: string;
          invoice_id?: string | null;
          method: Database['public']['Enums']['payment_method'];
          status?: Database['public']['Enums']['payment_status'];
          updated_at?: string | null;
        };
        Update: {
          amount?: number;
          appointment_id?: string | null;
          company_id?: string;
          created_at?: string | null;
          currency?: Database['public']['Enums']['currency'];
          customer_id?: string;
          employee_id?: string | null;
          id?: string;
          invoice_id?: string | null;
          method?: Database['public']['Enums']['payment_method'];
          status?: Database['public']['Enums']['payment_status'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'payments_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'payments_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          }
        ];
      };
      payments_meta: {
        Row: {
          id: string;
          meta_key: string;
          meta_value: string | null;
          payment_id: string;
        };
        Insert: {
          id?: string;
          meta_key: string;
          meta_value?: string | null;
          payment_id: string;
        };
        Update: {
          id?: string;
          meta_key?: string;
          meta_value?: string | null;
          payment_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_meta_payment_id_fkey';
            columns: ['payment_id'];
            isOneToOne: false;
            referencedRelation: 'payments';
            referencedColumns: ['id'];
          }
        ];
      };
      profile_meta: {
        Row: {
          company_id: string | null;
          id: string;
          meta_key: string;
          meta_value: string | null;
          user_id: string;
        };
        Insert: {
          company_id?: string | null;
          id?: string;
          meta_key: string;
          meta_value?: string | null;
          user_id: string;
        };
        Update: {
          company_id?: string | null;
          id?: string;
          meta_key?: string;
          meta_value?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_meta_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_meta_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'profile_meta_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          phone: string | null;
          profile_type: Database['public']['Enums']['profile_type'];
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          phone?: string | null;
          profile_type: Database['public']['Enums']['profile_type'];
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          phone?: string | null;
          profile_type?: Database['public']['Enums']['profile_type'];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          appointment_id: string | null;
          approved_at: string | null;
          approved_by: string | null;
          comment: string | null;
          company_id: string;
          created_at: string | null;
          customer_id: string;
          employee_id: string | null;
          id: string;
          is_approved: boolean | null;
          is_public: boolean;
          rating: number;
          service_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          appointment_id?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          comment?: string | null;
          company_id: string;
          created_at?: string | null;
          customer_id: string;
          employee_id?: string | null;
          id?: string;
          is_approved?: boolean | null;
          is_public?: boolean;
          rating: number;
          service_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          appointment_id?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          comment?: string | null;
          company_id?: string;
          created_at?: string | null;
          customer_id?: string;
          employee_id?: string | null;
          id?: string;
          is_approved?: boolean | null;
          is_public?: boolean;
          rating?: number;
          service_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_approved_by_fkey';
            columns: ['approved_by'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'reviews_approved_by_fkey';
            columns: ['approved_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'reviews_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'reviews_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reviews_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          }
        ];
      };
      reviews_meta: {
        Row: {
          id: string;
          meta_key: string;
          meta_value: string | null;
          review_id: string;
        };
        Insert: {
          id?: string;
          meta_key: string;
          meta_value?: string | null;
          review_id: string;
        };
        Update: {
          id?: string;
          meta_key?: string;
          meta_value?: string | null;
          review_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_meta_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          }
        ];
      };
      service_meta: {
        Row: {
          company_id: string | null;
          created_at: string | null;
          employee_id: string | null;
          id: string;
          meta_key: string;
          meta_value: string | null;
          service_id: string;
          updated_at: string | null;
        };
        Insert: {
          company_id?: string | null;
          created_at?: string | null;
          employee_id?: string | null;
          id?: string;
          meta_key: string;
          meta_value?: string | null;
          service_id: string;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string | null;
          created_at?: string | null;
          employee_id?: string | null;
          id?: string;
          meta_key?: string;
          meta_value?: string | null;
          service_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'service_meta_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'service_meta_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'service_meta_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'service_meta_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          }
        ];
      };
      services: {
        Row: {
          content: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          image: string | null;
          slug: string | null;
          status: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          slug?: string | null;
          status?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          slug?: string | null;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          company_id: string;
          created_at: string | null;
          customer_id: string;
          employee_id: string;
          id: string;
          note: string | null;
          preferred_end_date: string;
          preferred_end_time: string | null;
          preferred_start_date: string;
          preferred_start_time: string | null;
          priority_score: number;
          service_id: string | null;
          status: Database['public']['Enums']['waitlist_status'];
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          created_at?: string | null;
          customer_id: string;
          employee_id: string;
          id?: string;
          note?: string | null;
          preferred_end_date: string;
          preferred_end_time?: string | null;
          preferred_start_date: string;
          preferred_start_time?: string | null;
          priority_score?: number;
          service_id?: string | null;
          status?: Database['public']['Enums']['waitlist_status'];
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          created_at?: string | null;
          customer_id?: string;
          employee_id?: string;
          id?: string;
          note?: string | null;
          preferred_end_date?: string;
          preferred_end_time?: string | null;
          preferred_start_date?: string;
          preferred_start_time?: string | null;
          priority_score?: number;
          service_id?: string | null;
          status?: Database['public']['Enums']['waitlist_status'];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'waitlist_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'waitlist_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'waitlist_customer_id_fkey';
            columns: ['customer_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'waitlist_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'waitlist_employee_id_fkey';
            columns: ['employee_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'waitlist_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'services';
            referencedColumns: ['id'];
          }
        ];
      };
      waitlist_meta: {
        Row: {
          id: string;
          meta_key: string;
          meta_value: string | null;
          waitlist_id: string;
        };
        Insert: {
          id?: string;
          meta_key: string;
          meta_value?: string | null;
          waitlist_id: string;
        };
        Update: {
          id?: string;
          meta_key?: string;
          meta_value?: string | null;
          waitlist_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'waitlist_meta_waitlist_id_fkey';
            columns: ['waitlist_id'];
            isOneToOne: false;
            referencedRelation: 'waitlist';
            referencedColumns: ['id'];
          }
        ];
      };
      whatsapp_messages: {
        Row: {
          appointment_id: string | null;
          company_id: string | null;
          conversation_id: string | null;
          created_at: string | null;
          customer_response: string | null;
          delivered_at: string | null;
          direction: Database['public']['Enums']['whatsapp_message_direction'];
          error_message: string | null;
          external_id: string | null;
          id: string;
          message_content: string;
          message_template: string | null;
          message_type: Database['public']['Enums']['whatsapp_message_type'];
          metadata: Json | null;
          notification_id: string | null;
          parent_message_id: string | null;
          read_at: string | null;
          recipient_customer_id: string | null;
          recipient_id: string | null;
          recipient_phone: string | null;
          replied_at: string | null;
          requires_response: boolean | null;
          response_status:
            | Database['public']['Enums']['whatsapp_response_status']
            | null;
          retry_count: number | null;
          sender_customer_id: string | null;
          sender_id: string | null;
          sender_phone: string | null;
          sent_at: string | null;
          status: Database['public']['Enums']['whatsapp_message_status'] | null;
          updated_at: string | null;
        };
        Insert: {
          appointment_id?: string | null;
          company_id?: string | null;
          conversation_id?: string | null;
          created_at?: string | null;
          customer_response?: string | null;
          delivered_at?: string | null;
          direction?: Database['public']['Enums']['whatsapp_message_direction'];
          error_message?: string | null;
          external_id?: string | null;
          id?: string;
          message_content: string;
          message_template?: string | null;
          message_type: Database['public']['Enums']['whatsapp_message_type'];
          metadata?: Json | null;
          notification_id?: string | null;
          parent_message_id?: string | null;
          read_at?: string | null;
          recipient_customer_id?: string | null;
          recipient_id?: string | null;
          recipient_phone?: string | null;
          replied_at?: string | null;
          requires_response?: boolean | null;
          response_status?:
            | Database['public']['Enums']['whatsapp_response_status']
            | null;
          retry_count?: number | null;
          sender_customer_id?: string | null;
          sender_id?: string | null;
          sender_phone?: string | null;
          sent_at?: string | null;
          status?:
            | Database['public']['Enums']['whatsapp_message_status']
            | null;
          updated_at?: string | null;
        };
        Update: {
          appointment_id?: string | null;
          company_id?: string | null;
          conversation_id?: string | null;
          created_at?: string | null;
          customer_response?: string | null;
          delivered_at?: string | null;
          direction?: Database['public']['Enums']['whatsapp_message_direction'];
          error_message?: string | null;
          external_id?: string | null;
          id?: string;
          message_content?: string;
          message_template?: string | null;
          message_type?: Database['public']['Enums']['whatsapp_message_type'];
          metadata?: Json | null;
          notification_id?: string | null;
          parent_message_id?: string | null;
          read_at?: string | null;
          recipient_customer_id?: string | null;
          recipient_id?: string | null;
          recipient_phone?: string | null;
          replied_at?: string | null;
          requires_response?: boolean | null;
          response_status?:
            | Database['public']['Enums']['whatsapp_response_status']
            | null;
          retry_count?: number | null;
          sender_customer_id?: string | null;
          sender_id?: string | null;
          sender_phone?: string | null;
          sent_at?: string | null;
          status?:
            | Database['public']['Enums']['whatsapp_message_status']
            | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'whatsapp_messages_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_notification_id_fkey';
            columns: ['notification_id'];
            isOneToOne: false;
            referencedRelation: 'notifications';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_parent_message_id_fkey';
            columns: ['parent_message_id'];
            isOneToOne: false;
            referencedRelation: 'whatsapp_messages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_recipient_customer_id_fkey';
            columns: ['recipient_customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_recipient_id_fkey';
            columns: ['recipient_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_sender_customer_id_fkey';
            columns: ['sender_customer_id'];
            isOneToOne: false;
            referencedRelation: 'customers';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'employee_shifts_view';
            referencedColumns: ['employee_id'];
          },
          {
            foreignKeyName: 'whatsapp_messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      employee_shifts_view: {
        Row: {
          company_id: string | null;
          company_name: string | null;
          email: string | null;
          employee_id: string | null;
          first_name: string | null;
          last_name: string | null;
          shift_created_at: string | null;
          shift_data_json: string | null;
          shift_id: string | null;
          shift_meta_id: string | null;
          shift_updated_at: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'company_meta_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Functions: {
      add_customer_to_company: {
        Args: { p_company_id: string; p_customer_id: string };
        Returns: string;
      };
      auto_expire_invites: { Args: never; Returns: number };
      create_audit_log: {
        Args: {
          p_action: Database['public']['Enums']['audit_action'];
          p_actor_id?: string;
          p_company_id?: string;
          p_ip_address?: unknown;
          p_metadata?: Json;
          p_new_values?: Json;
          p_old_values?: Json;
          p_record_id?: string;
          p_table_name: string;
          p_user_agent?: string;
        };
        Returns: string;
      };
      create_customer_profile: {
        Args: {
          p_company_id: string;
          p_email?: string;
          p_first_name?: string;
          p_last_name?: string;
          p_phone: string;
        };
        Returns: string;
      };
      create_notification: {
        Args: {
          p_company_id?: string;
          p_customer_id?: string;
          p_message?: string;
          p_metadata?: Json;
          p_related_id?: string;
          p_related_type?: string;
          p_title?: string;
          p_type?: Database['public']['Enums']['notification_type'];
          p_user_id?: string;
        };
        Returns: string;
      };
      create_organization_invite: {
        Args: {
          p_company_id: string;
          p_email?: string;
          p_expires_in_days?: number;
          p_invited_by: string;
          p_metadata?: Json;
          p_phone?: string;
          p_role: Database['public']['Enums']['app_role'];
          p_user_id?: string;
        };
        Returns: string;
      };
      create_whatsapp_message:
        | {
            Args: {
              p_appointment_id?: string;
              p_company_id?: string;
              p_conversation_id?: string;
              p_direction?: Database['public']['Enums']['whatsapp_message_direction'];
              p_message_content: string;
              p_message_template?: string;
              p_message_type: Database['public']['Enums']['whatsapp_message_type'];
              p_metadata?: Json;
              p_notification_id?: string;
              p_parent_message_id?: string;
              p_recipient_customer_id?: string;
              p_recipient_id?: string;
              p_recipient_phone?: string;
              p_requires_response?: boolean;
              p_sender_customer_id?: string;
              p_sender_id?: string;
              p_sender_phone?: string;
            };
            Returns: string;
          }
        | {
            Args: {
              p_appointment_id?: string;
              p_company_id?: string;
              p_conversation_id?: string;
              p_direction?: Database['public']['Enums']['whatsapp_message_direction'];
              p_message_content: string;
              p_message_template?: string;
              p_message_type: Database['public']['Enums']['whatsapp_message_type'];
              p_metadata?: Json;
              p_notification_id?: string;
              p_parent_message_id?: string;
              p_recipient_id?: string;
              p_recipient_phone?: string;
              p_requires_response?: boolean;
              p_sender_id?: string;
              p_sender_phone?: string;
            };
            Returns: string;
          };
      generate_invite_code: { Args: never; Returns: string };
      get_accessible_companies: {
        Args: { p_company_id: string };
        Returns: Json;
      };
      get_company_customers: {
        Args: { p_company_id: string };
        Returns: {
          avatar_url: string;
          company_id: string;
          customer_id: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
        }[];
      };
      get_customer_companies: {
        Args: { p_customer_id: string };
        Returns: {
          company_id: string;
          company_name: string;
          customer_id: string;
          id: string;
        }[];
      };
      get_employee_company_schedule: {
        Args: {
          p_company_id: string;
          p_employee_id: string;
          p_end_date?: string;
          p_start_date?: string;
        };
        Returns: Json;
      };
      get_employee_shift: {
        Args: {
          p_company_id?: string;
          p_employee_id?: string;
          p_include_inactive?: boolean;
        };
        Returns: {
          company_id: string;
          company_name: string;
          employee_email: string;
          employee_id: string;
          employee_name: string;
          shift_created_at: string;
          shift_data: Json;
          shift_description: string;
          shift_id: string;
          shift_is_active: boolean;
          shift_name: string;
          shift_status: string;
        }[];
      };
      get_my_company_ids: {
        Args: never;
        Returns: {
          company_id: string;
        }[];
      };
      get_organization_invites: {
        Args: {
          p_company_id?: string;
          p_phone?: string;
          p_status?: Database['public']['Enums']['invite_status'];
          p_user_id?: string;
        };
        Returns: {
          accepted_at: string;
          cancelled_at: string;
          company_id: string;
          company_name: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          invite_code: string;
          invited_by: string;
          inviter_email: string;
          inviter_name: string;
          is_expired: boolean;
          metadata: Json;
          phone: string;
          rejected_at: string;
          role: Database['public']['Enums']['app_role'];
          status: Database['public']['Enums']['invite_status'];
          updated_at: string;
          user_email: string;
          user_id: string;
          user_name: string;
        }[];
      };
      get_shift_schedule_for_day: {
        Args: { p_company_id: string; p_day: string; p_employee_id: string };
        Returns: {
          day: string;
          end_time: string;
          shift_name: string;
          start_time: string;
        }[];
      };
      get_staff_with_services: {
        Args: { p_company_id: string };
        Returns: {
          assigned_services: Json;
          avatar_url: string;
          email: string;
          first_name: string;
          is_active: boolean;
          joined_at: string;
          last_name: string;
          member_id: string;
          phone: string;
          role: Database['public']['Enums']['app_role'];
          shift_meta_id: string;
          user_id: string;
          working_hours_group_id: string;
          working_hours_group_name: string;
        }[];
      };
      get_user_companies: {
        Args: never;
        Returns: {
          company_id: string;
          company_name: string;
          parent_company_id: string;
          role: Database['public']['Enums']['app_role'];
        }[];
      };
      get_waitlist_by_employee: {
        Args: {
          p_employee_id: string;
          p_status?: Database['public']['Enums']['waitlist_status'];
        };
        Returns: {
          company_id: string;
          created_at: string;
          customer_id: string;
          id: string;
          note: string;
          preferred_end_date: string;
          preferred_end_time: string;
          preferred_start_date: string;
          preferred_start_time: string;
          priority_score: number;
          service_id: string;
          status: Database['public']['Enums']['waitlist_status'];
          updated_at: string;
        }[];
      };
      get_waitlist_by_priority: {
        Args: { p_employee_id: string };
        Returns: {
          company_id: string;
          created_at: string;
          customer_id: string;
          id: string;
          note: string;
          preferred_end_date: string;
          preferred_end_time: string;
          preferred_start_date: string;
          preferred_start_time: string;
          priority_score: number;
          service_id: string;
          status: Database['public']['Enums']['waitlist_status'];
          updated_at: string;
        }[];
      };
      handle_whatsapp_response: {
        Args: {
          p_company_id?: string;
          p_conversation_id?: string;
          p_external_id: string;
          p_message_content: string;
          p_metadata?: Json;
          p_parent_message_id?: string;
          p_sender_id?: string;
          p_sender_phone?: string;
        };
        Returns: string;
      };
      is_employee: { Args: { user_uuid: string }; Returns: boolean };
      login_check: {
        Args: never;
        Returns: {
          company_id: string;
          has_access: boolean;
          is_active: boolean;
          is_employee: boolean;
          parent_company_id: string;
          role: Database['public']['Enums']['app_role'];
        }[];
      };
      mutation_accept_organization_invite: {
        Args: {
          p_invite_code?: string;
          p_invite_id?: string;
          p_user_id: string;
        };
        Returns: string;
      };
      mutation_cancel_organization_invite: {
        Args: { p_cancelled_by: string; p_invite_id: string };
        Returns: string;
      };
      mutation_reject_organization_invite: {
        Args: {
          p_invite_code?: string;
          p_invite_id?: string;
          p_user_id?: string;
        };
        Returns: string;
      };
      set_whatsapp_message_external_id: {
        Args: { p_external_id: string; p_message_id: string };
        Returns: undefined;
      };
      update_profile_company: {
        Args: { p_company_id: string };
        Returns: undefined;
      };
      update_whatsapp_message_status: {
        Args: {
          p_error_message?: string;
          p_external_id: string;
          p_status: Database['public']['Enums']['whatsapp_message_status'];
        };
        Returns: string;
      };
    };
    Enums: {
      app_role:
        | 'owner'
        | 'admin'
        | 'accountant'
        | 'manager'
        | 'staff'
        | 'assistant';
      appointment_status:
        | 'pending'
        | 'customer_confirmed'
        | 'customer_rejected'
        | 'confirmed'
        | 'rejected'
        | 'in_progress'
        | 'completed'
        | 'no_show'
        | 'cancelled';
      attachment_record_type:
        | 'appointment'
        | 'profile'
        | 'consultation'
        | 'review'
        | 'invoice'
        | 'payment'
        | 'other';
      audit_action: 'CREATE' | 'UPDATE' | 'DELETE';
      currency: 'TRY' | 'USD' | 'EUR' | 'GBP';
      invite_status:
        | 'pending'
        | 'accepted'
        | 'rejected'
        | 'cancelled'
        | 'expired';
      invoice_status: 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';
      invoice_type: 'service' | 'product' | 'subscription' | 'other';
      notification_type:
        | 'appointment_created'
        | 'appointment_confirmed'
        | 'appointment_cancelled'
        | 'appointment_updated'
        | 'appointment_reminder'
        | 'appointment_completed'
        | 'appointment_no_show'
        | 'organization_invite'
        | 'general';
      payment_method:
        | 'credit_card'
        | 'cash'
        | 'transfer'
        | 'insurance'
        | 'other';
      payment_status: 'pending' | 'paid' | 'refunded' | 'failed' | 'cancelled';
      profile_type: 'employee' | 'customer';
      waitlist_status:
        | 'pending'
        | 'notified'
        | 'converted'
        | 'cancelled'
        | 'expired';
      whatsapp_message_direction: 'outbound' | 'inbound';
      whatsapp_message_status:
        | 'pending'
        | 'sent'
        | 'delivered'
        | 'read'
        | 'replied'
        | 'failed';
      whatsapp_message_type:
        | 'appointment_confirmation'
        | 'appointment_reminder'
        | 'employee_notification'
        | 'employee_reminder'
        | 'ai_conversation'
        | 'information'
        | 'promotional'
        | 'support'
        | 'organization_invite'
        | 'other';
      whatsapp_response_status:
        | 'confirmed'
        | 'rejected'
        | 'no_response'
        | 'pending_action'
        | 'completed';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      app_role: [
        'owner',
        'admin',
        'accountant',
        'manager',
        'staff',
        'assistant',
      ],
      appointment_status: [
        'pending',
        'customer_confirmed',
        'customer_rejected',
        'confirmed',
        'rejected',
        'in_progress',
        'completed',
        'no_show',
        'cancelled',
      ],
      attachment_record_type: [
        'appointment',
        'profile',
        'consultation',
        'review',
        'invoice',
        'payment',
        'other',
      ],
      audit_action: ['CREATE', 'UPDATE', 'DELETE'],
      currency: ['TRY', 'USD', 'EUR', 'GBP'],
      invite_status: [
        'pending',
        'accepted',
        'rejected',
        'cancelled',
        'expired',
      ],
      invoice_status: ['draft', 'issued', 'paid', 'cancelled', 'overdue'],
      invoice_type: ['service', 'product', 'subscription', 'other'],
      notification_type: [
        'appointment_created',
        'appointment_confirmed',
        'appointment_cancelled',
        'appointment_updated',
        'appointment_reminder',
        'appointment_completed',
        'appointment_no_show',
        'organization_invite',
        'general',
      ],
      payment_method: ['credit_card', 'cash', 'transfer', 'insurance', 'other'],
      payment_status: ['pending', 'paid', 'refunded', 'failed', 'cancelled'],
      profile_type: ['employee', 'customer'],
      waitlist_status: [
        'pending',
        'notified',
        'converted',
        'cancelled',
        'expired',
      ],
      whatsapp_message_direction: ['outbound', 'inbound'],
      whatsapp_message_status: [
        'pending',
        'sent',
        'delivered',
        'read',
        'replied',
        'failed',
      ],
      whatsapp_message_type: [
        'appointment_confirmation',
        'appointment_reminder',
        'employee_notification',
        'employee_reminder',
        'ai_conversation',
        'information',
        'promotional',
        'support',
        'organization_invite',
        'other',
      ],
      whatsapp_response_status: [
        'confirmed',
        'rejected',
        'no_response',
        'pending_action',
        'completed',
      ],
    },
  },
} as const;
