import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from './supabase';

// Filter operators
export const FilterOperatorSchema = z.enum([
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'ilike',
  'is',
  'in',
]);
export type FilterOperator = z.infer<typeof FilterOperatorSchema>;

// Single filter condition
export const FilterConditionSchema = z.object({
  column: z.string(),
  operator: FilterOperatorSchema,
  value: z.unknown(),
});
export type FilterCondition = z.infer<typeof FilterConditionSchema>;

// Sort direction
export const SortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof SortDirectionSchema>;

// Sort option
export const SortOptionSchema = z.object({
  column: z.string(),
  direction: SortDirectionSchema.optional().default('asc'),
});
export type SortOption = z.infer<typeof SortOptionSchema>;

// Pagination options
export const PaginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(1).max(100).optional().default(10),
});
export type Pagination = z.infer<typeof PaginationSchema>;

// Query options combining filters, sorting, pagination, and select
export const QueryOptionsSchema = z.object({
  enabled: z.boolean().optional(),
  filters: z.array(FilterConditionSchema).optional(),
  sort: SortOptionSchema.optional(),
  pagination: PaginationSchema.optional(),
  select: z.string().optional(),
  queryKey: z.array(z.unknown()).optional(),
});
export type QueryOptions = z.infer<typeof QueryOptionsSchema>;

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

function applyFilters<T>(query: T, filters?: FilterCondition[]): T {
  if (!filters || filters.length === 0) return query;

  let result = query as any;
  for (const filter of filters) {
    const { column, operator, value } = filter;
    switch (operator) {
      case 'eq':
        result = result.eq(column, value);
        break;
      case 'neq':
        result = result.neq(column, value);
        break;
      case 'gt':
        result = result.gt(column, value);
        break;
      case 'gte':
        result = result.gte(column, value);
        break;
      case 'lt':
        result = result.lt(column, value);
        break;
      case 'lte':
        result = result.lte(column, value);
        break;
      case 'like':
        result = result.like(column, value);
        break;
      case 'ilike':
        result = result.ilike(column, value);
        break;
      case 'is':
        result = result.is(column, value);
        break;
      case 'in':
        result = result.in(column, value as any[]);
        break;
    }
  }
  return result as T;
}

export const AppRoleSchema = z.enum([
  'owner',
  'admin',
  'accountant',
  'manager',
  'staff',
  'assistant',
]);

export const AppointmentStatusSchema = z.enum([
  'pending',
  'customer_confirmed',
  'customer_rejected',
  'confirmed',
  'rejected',
  'in_progress',
  'completed',
  'no_show',
  'cancelled',
]);

export const AttachmentRecordTypeSchema = z.enum([
  'appointment',
  'profile',
  'consultation',
  'review',
  'invoice',
  'payment',
  'other',
]);

export const AuditActionSchema = z.enum(['CREATE', 'UPDATE', 'DELETE']);

export const CurrencySchema = z.enum(['TRY', 'USD', 'EUR', 'GBP']);

export const InviteStatusSchema = z.enum([
  'pending',
  'rejected',
  'cancelled',
  'accepted',
  'expired',
]);

export const InvoiceStatusSchema = z.enum([
  'cancelled',
  'draft',
  'issued',
  'paid',
  'overdue',
]);

export const InvoiceTypeSchema = z.enum([
  'other',
  'service',
  'product',
  'subscription',
]);

export const NotificationTypeSchema = z.enum([
  'appointment_created',
  'appointment_confirmed',
  'appointment_cancelled',
  'appointment_updated',
  'appointment_reminder',
  'appointment_completed',
  'appointment_no_show',
  'organization_invite',
  'general',
]);

export const PaymentMethodSchema = z.enum([
  'other',
  'credit_card',
  'cash',
  'transfer',
  'insurance',
]);

export const PaymentStatusSchema = z.enum([
  'pending',
  'cancelled',
  'paid',
  'refunded',
  'failed',
]);

export const ProfileTypeSchema = z.enum(['employee', 'customer']);

export const WaitlistStatusSchema = z.enum([
  'pending',
  'cancelled',
  'expired',
  'notified',
  'converted',
]);

export const WhatsappMessageDirectionSchema = z.enum(['outbound', 'inbound']);

export const WhatsappMessageStatusSchema = z.enum([
  'pending',
  'failed',
  'sent',
  'delivered',
  'read',
  'replied',
]);

export const WhatsappMessageTypeSchema = z.enum([
  'other',
  'appointment_reminder',
  'organization_invite',
  'appointment_confirmation',
  'employee_notification',
  'employee_reminder',
  'ai_conversation',
  'information',
  'promotional',
  'support',
]);

export const WhatsappResponseStatusSchema = z.enum([
  'confirmed',
  'rejected',
  'completed',
  'no_response',
  'pending_action',
]);

export const AppointmentServiceSchema = z.object({
  appointment_id: z.string(),
  created_at: z.string().nullable(),
  id: z.string(),
  service_id: z.string(),
});

export const AddAppointmentServiceRequestSchema = z.object({
  appointment_id: z.string(),
  created_at: z.string().nullable().optional(),
  id: z.string().optional(),
  service_id: z.string(),
});

export const UpdateAppointmentServiceRequestSchema = z
  .object({
    appointment_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    service_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const AppointmentSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable(),
  customer_id: z.string().nullable(),
  date: z.string(),
  duration_seconds: z.number(),
  employee_id: z.string().nullable(),
  end_time: z.string(),
  id: z.string(),
  note: z.string().nullable(),
  start_time: z.string(),
  status: z.enum([
    'pending',
    'customer_confirmed',
    'customer_rejected',
    'confirmed',
    'rejected',
    'in_progress',
    'completed',
    'no_show',
    'cancelled',
  ]),
  title: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const AddAppointmentRequestSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  customer_id: z.string().nullable().optional(),
  date: z.string(),
  duration_seconds: z.number(),
  employee_id: z.string().nullable().optional(),
  end_time: z.string(),
  id: z.string().optional(),
  note: z.string().nullable().optional(),
  start_time: z.string(),
  status: z
    .enum([
      'pending',
      'customer_confirmed',
      'customer_rejected',
      'confirmed',
      'rejected',
      'in_progress',
      'completed',
      'no_show',
      'cancelled',
    ])
    .optional(),
  title: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateAppointmentRequestSchema = z
  .object({
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    customer_id: z.string().nullable().optional(),
    date: z.string().optional(),
    duration_seconds: z.number().optional(),
    employee_id: z.string().nullable().optional(),
    end_time: z.string().optional(),
    note: z.string().nullable().optional(),
    start_time: z.string().optional(),
    status: z
      .enum([
        'pending',
        'customer_confirmed',
        'customer_rejected',
        'confirmed',
        'rejected',
        'in_progress',
        'completed',
        'no_show',
        'cancelled',
      ])
      .optional(),
    title: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const AssistantAssignmentSchema = z.object({
  assistant_member_id: z.string(),
  created_at: z.string().nullable(),
  id: z.string(),
  target_member_id: z.string(),
});

export const AddAssistantAssignmentRequestSchema = z.object({
  assistant_member_id: z.string(),
  created_at: z.string().nullable().optional(),
  id: z.string().optional(),
  target_member_id: z.string(),
});

export const UpdateAssistantAssignmentRequestSchema = z
  .object({
    assistant_member_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    target_member_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const AttachmentSchema = z.object({
  company_id: z.string().nullable(),
  created_at: z.string().nullable(),
  created_by: z.string().nullable(),
  description: z.string().nullable(),
  file_extension: z.string().nullable(),
  file_name: z.string().nullable(),
  file_path: z.string(),
  file_size: z.number().nullable(),
  file_type: z.string(),
  id: z.string(),
  is_public: z.unknown(),
  metadata: z.unknown().nullable(),
  record_id: z.string(),
  record_type: z.enum([
    'appointment',
    'profile',
    'consultation',
    'review',
    'invoice',
    'payment',
    'other',
  ]),
  updated_at: z.string().nullable(),
});

export const AddAttachmentRequestSchema = z.object({
  company_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  created_by: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  file_extension: z.string().nullable().optional(),
  file_name: z.string().nullable().optional(),
  file_path: z.string(),
  file_size: z.number().nullable().optional(),
  file_type: z.string(),
  id: z.string().optional(),
  is_public: z.unknown().optional(),
  metadata: z.unknown().nullable().optional(),
  record_id: z.string(),
  record_type: z.enum([
    'appointment',
    'profile',
    'consultation',
    'review',
    'invoice',
    'payment',
    'other',
  ]),
  updated_at: z.string().nullable().optional(),
});

export const UpdateAttachmentRequestSchema = z
  .object({
    company_id: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    created_by: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    file_extension: z.string().nullable().optional(),
    file_name: z.string().nullable().optional(),
    file_path: z.string().optional(),
    file_size: z.number().nullable().optional(),
    file_type: z.string().optional(),
    is_public: z.unknown().optional(),
    metadata: z.unknown().nullable().optional(),
    record_id: z.string().optional(),
    record_type: z
      .enum([
        'appointment',
        'profile',
        'consultation',
        'review',
        'invoice',
        'payment',
        'other',
      ])
      .optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const AuditLogSchema = z.object({
  action: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  actor_id: z.string().nullable(),
  company_id: z.string().nullable(),
  created_at: z.string().nullable(),
  id: z.string(),
  ip_address: z.unknown(),
  metadata: z.unknown().nullable(),
  new_values: z.unknown().nullable(),
  old_values: z.unknown().nullable(),
  record_id: z.string().nullable(),
  table_name: z.string(),
  user_agent: z.string().nullable(),
});

export const AddAuditLogRequestSchema = z.object({
  action: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  actor_id: z.string().nullable().optional(),
  company_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  id: z.string().optional(),
  ip_address: z.unknown().optional(),
  metadata: z.unknown().nullable().optional(),
  new_values: z.unknown().nullable().optional(),
  old_values: z.unknown().nullable().optional(),
  record_id: z.string().nullable().optional(),
  table_name: z.string(),
  user_agent: z.string().nullable().optional(),
});

export const UpdateAuditLogRequestSchema = z
  .object({
    action: z.enum(['CREATE', 'UPDATE', 'DELETE']).optional(),
    actor_id: z.string().nullable().optional(),
    company_id: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    ip_address: z.unknown().optional(),
    metadata: z.unknown().nullable().optional(),
    new_values: z.unknown().nullable().optional(),
    old_values: z.unknown().nullable().optional(),
    record_id: z.string().nullable().optional(),
    table_name: z.string().optional(),
    user_agent: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const CompanySchema = z.object({
  created_at: z.string().nullable(),
  id: z.string(),
  name: z.string(),
  owner_id: z.string(),
  parent_id: z.string().nullable(),
  slug: z.string().nullable(),
  tax_id: z.string().nullable(),
});

export const AddCompanyRequestSchema = z.object({
  created_at: z.string().nullable().optional(),
  id: z.string().optional(),
  name: z.string(),
  owner_id: z.string(),
  parent_id: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  tax_id: z.string().nullable().optional(),
});

export const UpdateCompanyRequestSchema = z
  .object({
    created_at: z.string().nullable().optional(),
    name: z.string().optional(),
    owner_id: z.string().optional(),
    parent_id: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    tax_id: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const CompanyMetaSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable(),
  id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const AddCompanyMetaRequestSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  id: z.string().optional(),
  meta_key: z.string(),
  meta_value: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateCompanyMetaRequestSchema = z
  .object({
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    meta_key: z.string().optional(),
    meta_value: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const CustomerCompanyRelationSchema = z.object({
  company_id: z.string(),
  customer_id: z.string(),
  id: z.string(),
});

export const AddCustomerCompanyRelationRequestSchema = z.object({
  company_id: z.string(),
  customer_id: z.string(),
  id: z.string().optional(),
});

export const UpdateCustomerCompanyRelationRequestSchema = z
  .object({
    company_id: z.string().optional(),
    customer_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const CustomerSchema = z.object({
  address: z.string().nullable(),
  avatar_url: z.string().nullable(),
  birth_date: z.string().nullable(),
  created_at: z.string().nullable(),
  email: z.string().nullable(),
  first_name: z.string().nullable(),
  gender: z.string().nullable(),
  id: z.string(),
  last_name: z.string().nullable(),
  notes: z.string().nullable(),
  phone: z.string().nullable(),
  updated_at: z.string().nullable(),
  user_id: z.string().nullable(),
});

export const AddCustomerRequestSchema = z.object({
  address: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  birth_date: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  id: z.string().optional(),
  last_name: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
});

export const UpdateCustomerRequestSchema = z
  .object({
    address: z.string().nullable().optional(),
    avatar_url: z.string().nullable().optional(),
    birth_date: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    gender: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
    user_id: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const EmployeeServiceRelationSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable(),
  employee_id: z.string().nullable(),
  id: z.string(),
  is_active: z.unknown().nullable(),
  service_id: z.string(),
  updated_at: z.string().nullable(),
});

export const AddEmployeeServiceRelationRequestSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  employee_id: z.string().nullable().optional(),
  id: z.string().optional(),
  is_active: z.unknown().nullable().optional(),
  service_id: z.string(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateEmployeeServiceRelationRequestSchema = z
  .object({
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    employee_id: z.string().nullable().optional(),
    is_active: z.unknown().nullable().optional(),
    service_id: z.string().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const EmployeeWorkingLeaveSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable(),
  date: z.string(),
  duration_seconds: z.number(),
  employee_id: z.string(),
  end_time: z.string(),
  id: z.string(),
  note: z.string().nullable(),
  start_time: z.string(),
  status: z.string(),
  title: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const AddEmployeeWorkingLeaveRequestSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  date: z.string(),
  duration_seconds: z.number(),
  employee_id: z.string(),
  end_time: z.string(),
  id: z.string().optional(),
  note: z.string().nullable().optional(),
  start_time: z.string(),
  status: z.string().optional(),
  title: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateEmployeeWorkingLeaveRequestSchema = z
  .object({
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    date: z.string().optional(),
    duration_seconds: z.number().optional(),
    employee_id: z.string().optional(),
    end_time: z.string().optional(),
    note: z.string().nullable().optional(),
    start_time: z.string().optional(),
    status: z.string().optional(),
    title: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const InvoiceSchema = z.object({
  appointment_id: z.string().nullable(),
  company_id: z.string(),
  created_at: z.string().nullable(),
  currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']),
  customer_id: z.string(),
  discount_amount: z.number().nullable(),
  due_date: z.string().nullable(),
  employee_id: z.string().nullable(),
  id: z.string(),
  invoice_number: z.string(),
  invoice_type: z.enum(['other', 'service', 'product', 'subscription']),
  issue_date: z.string(),
  status: z.enum(['cancelled', 'draft', 'issued', 'paid', 'overdue']),
  subtotal: z.number(),
  tax_amount: z.number().nullable(),
  tax_rate: z.number(),
  total_amount: z.number(),
  updated_at: z.string().nullable(),
});

export const AddInvoiceRequestSchema = z.object({
  appointment_id: z.string().nullable().optional(),
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']).optional(),
  customer_id: z.string(),
  discount_amount: z.number().nullable().optional(),
  due_date: z.string().nullable().optional(),
  employee_id: z.string().nullable().optional(),
  id: z.string().optional(),
  invoice_number: z.string(),
  invoice_type: z
    .enum(['other', 'service', 'product', 'subscription'])
    .optional(),
  issue_date: z.string().optional(),
  status: z
    .enum(['cancelled', 'draft', 'issued', 'paid', 'overdue'])
    .optional(),
  subtotal: z.number(),
  tax_amount: z.number().nullable().optional(),
  tax_rate: z.number(),
  total_amount: z.number(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateInvoiceRequestSchema = z
  .object({
    appointment_id: z.string().nullable().optional(),
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']).optional(),
    customer_id: z.string().optional(),
    discount_amount: z.number().nullable().optional(),
    due_date: z.string().nullable().optional(),
    employee_id: z.string().nullable().optional(),
    invoice_number: z.string().optional(),
    invoice_type: z
      .enum(['other', 'service', 'product', 'subscription'])
      .optional(),
    issue_date: z.string().optional(),
    status: z
      .enum(['cancelled', 'draft', 'issued', 'paid', 'overdue'])
      .optional(),
    subtotal: z.number().optional(),
    tax_amount: z.number().nullable().optional(),
    tax_rate: z.number().optional(),
    total_amount: z.number().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const InvoicesMetaSchema = z.object({
  id: z.string(),
  invoice_id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable(),
});

export const AddInvoicesMetaRequestSchema = z.object({
  id: z.string().optional(),
  invoice_id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable().optional(),
});

export const UpdateInvoicesMetaRequestSchema = z
  .object({
    invoice_id: z.string().optional(),
    meta_key: z.string().optional(),
    meta_value: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const NotificationSchema = z.object({
  company_id: z.string().nullable(),
  created_at: z.string().nullable(),
  customer_id: z.string().nullable(),
  id: z.string(),
  is_read: z.unknown().nullable(),
  message: z.string().nullable(),
  metadata: z.unknown().nullable(),
  read_at: z.string().nullable(),
  related_id: z.string().nullable(),
  related_type: z.string().nullable(),
  title: z.string(),
  type: z.enum([
    'appointment_created',
    'appointment_confirmed',
    'appointment_cancelled',
    'appointment_updated',
    'appointment_reminder',
    'appointment_completed',
    'appointment_no_show',
    'organization_invite',
    'general',
  ]),
  user_id: z.string().nullable(),
});

export const AddNotificationRequestSchema = z.object({
  company_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  customer_id: z.string().nullable().optional(),
  id: z.string().optional(),
  is_read: z.unknown().nullable().optional(),
  message: z.string().nullable().optional(),
  metadata: z.unknown().nullable().optional(),
  read_at: z.string().nullable().optional(),
  related_id: z.string().nullable().optional(),
  related_type: z.string().nullable().optional(),
  title: z.string(),
  type: z.enum([
    'appointment_created',
    'appointment_confirmed',
    'appointment_cancelled',
    'appointment_updated',
    'appointment_reminder',
    'appointment_completed',
    'appointment_no_show',
    'organization_invite',
    'general',
  ]),
  user_id: z.string().nullable().optional(),
});

export const UpdateNotificationRequestSchema = z
  .object({
    company_id: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    customer_id: z.string().nullable().optional(),
    is_read: z.unknown().nullable().optional(),
    message: z.string().nullable().optional(),
    metadata: z.unknown().nullable().optional(),
    read_at: z.string().nullable().optional(),
    related_id: z.string().nullable().optional(),
    related_type: z.string().nullable().optional(),
    title: z.string().optional(),
    type: z
      .enum([
        'appointment_created',
        'appointment_confirmed',
        'appointment_cancelled',
        'appointment_updated',
        'appointment_reminder',
        'appointment_completed',
        'appointment_no_show',
        'organization_invite',
        'general',
      ])
      .optional(),
    user_id: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const OrganizationInviteSchema = z.object({
  accepted_at: z.string().nullable(),
  cancelled_at: z.string().nullable(),
  company_id: z.string(),
  created_at: z.string().nullable(),
  email: z.string().nullable(),
  expires_at: z.string().nullable(),
  id: z.string(),
  invite_code: z.string(),
  invited_by: z.string(),
  metadata: z.unknown().nullable(),
  phone: z.string().nullable(),
  rejected_at: z.string().nullable(),
  role: z.enum([
    'owner',
    'admin',
    'accountant',
    'manager',
    'staff',
    'assistant',
  ]),
  status: z.enum(['pending', 'rejected', 'cancelled', 'accepted', 'expired']),
  updated_at: z.string().nullable(),
  user_id: z.string().nullable(),
});

export const AddOrganizationInviteRequestSchema = z.object({
  accepted_at: z.string().nullable().optional(),
  cancelled_at: z.string().nullable().optional(),
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  expires_at: z.string().nullable().optional(),
  id: z.string().optional(),
  invite_code: z.string(),
  invited_by: z.string(),
  metadata: z.unknown().nullable().optional(),
  phone: z.string().nullable().optional(),
  rejected_at: z.string().nullable().optional(),
  role: z.enum([
    'owner',
    'admin',
    'accountant',
    'manager',
    'staff',
    'assistant',
  ]),
  status: z
    .enum(['pending', 'rejected', 'cancelled', 'accepted', 'expired'])
    .optional(),
  updated_at: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
});

export const UpdateOrganizationInviteRequestSchema = z
  .object({
    accepted_at: z.string().nullable().optional(),
    cancelled_at: z.string().nullable().optional(),
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    expires_at: z.string().nullable().optional(),
    invite_code: z.string().optional(),
    invited_by: z.string().optional(),
    metadata: z.unknown().nullable().optional(),
    phone: z.string().nullable().optional(),
    rejected_at: z.string().nullable().optional(),
    role: z
      .enum(['owner', 'admin', 'accountant', 'manager', 'staff', 'assistant'])
      .optional(),
    status: z
      .enum(['pending', 'rejected', 'cancelled', 'accepted', 'expired'])
      .optional(),
    updated_at: z.string().nullable().optional(),
    user_id: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const OrganizationMemberSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable(),
  id: z.string(),
  is_active: z.unknown().nullable(),
  role: z.enum([
    'owner',
    'admin',
    'accountant',
    'manager',
    'staff',
    'assistant',
  ]),
  user_id: z.string(),
});

export const AddOrganizationMemberRequestSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  id: z.string().optional(),
  is_active: z.unknown().nullable().optional(),
  role: z.enum([
    'owner',
    'admin',
    'accountant',
    'manager',
    'staff',
    'assistant',
  ]),
  user_id: z.string(),
});

export const UpdateOrganizationMemberRequestSchema = z
  .object({
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    is_active: z.unknown().nullable().optional(),
    role: z
      .enum(['owner', 'admin', 'accountant', 'manager', 'staff', 'assistant'])
      .optional(),
    user_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const PaymentSchema = z.object({
  amount: z.number(),
  appointment_id: z.string().nullable(),
  company_id: z.string(),
  created_at: z.string().nullable(),
  currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']),
  customer_id: z.string(),
  employee_id: z.string().nullable(),
  id: z.string(),
  invoice_id: z.string().nullable(),
  method: z.enum(['other', 'credit_card', 'cash', 'transfer', 'insurance']),
  status: z.enum(['pending', 'cancelled', 'paid', 'refunded', 'failed']),
  updated_at: z.string().nullable(),
});

export const AddPaymentRequestSchema = z.object({
  amount: z.number(),
  appointment_id: z.string().nullable().optional(),
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']).optional(),
  customer_id: z.string(),
  employee_id: z.string().nullable().optional(),
  id: z.string().optional(),
  invoice_id: z.string().nullable().optional(),
  method: z.enum(['other', 'credit_card', 'cash', 'transfer', 'insurance']),
  status: z
    .enum(['pending', 'cancelled', 'paid', 'refunded', 'failed'])
    .optional(),
  updated_at: z.string().nullable().optional(),
});

export const UpdatePaymentRequestSchema = z
  .object({
    amount: z.number().optional(),
    appointment_id: z.string().nullable().optional(),
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']).optional(),
    customer_id: z.string().optional(),
    employee_id: z.string().nullable().optional(),
    invoice_id: z.string().nullable().optional(),
    method: z
      .enum(['other', 'credit_card', 'cash', 'transfer', 'insurance'])
      .optional(),
    status: z
      .enum(['pending', 'cancelled', 'paid', 'refunded', 'failed'])
      .optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const PaymentsMetaSchema = z.object({
  id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable(),
  payment_id: z.string(),
});

export const AddPaymentsMetaRequestSchema = z.object({
  id: z.string().optional(),
  meta_key: z.string(),
  meta_value: z.string().nullable().optional(),
  payment_id: z.string(),
});

export const UpdatePaymentsMetaRequestSchema = z
  .object({
    meta_key: z.string().optional(),
    meta_value: z.string().nullable().optional(),
    payment_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const ProfileMetaSchema = z.object({
  company_id: z.string().nullable(),
  id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable(),
  user_id: z.string(),
});

export const AddProfileMetaRequestSchema = z.object({
  company_id: z.string().nullable().optional(),
  id: z.string().optional(),
  meta_key: z.string(),
  meta_value: z.string().nullable().optional(),
  user_id: z.string(),
});

export const UpdateProfileMetaRequestSchema = z
  .object({
    company_id: z.string().nullable().optional(),
    meta_key: z.string().optional(),
    meta_value: z.string().nullable().optional(),
    user_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const ProfileSchema = z.object({
  avatar_url: z.string().nullable(),
  created_at: z.string().nullable(),
  email: z.string().nullable(),
  first_name: z.string().nullable(),
  id: z.string(),
  last_name: z.string().nullable(),
  phone: z.string().nullable(),
  profile_type: z.enum(['employee', 'customer']),
  updated_at: z.string().nullable(),
});

export const AddProfileRequestSchema = z.object({
  avatar_url: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  id: z.string(),
  last_name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  profile_type: z.enum(['employee', 'customer']),
  updated_at: z.string().nullable().optional(),
});

export const UpdateProfileRequestSchema = z
  .object({
    avatar_url: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    profile_type: z.enum(['employee', 'customer']).optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const ReviewSchema = z.object({
  appointment_id: z.string().nullable(),
  approved_at: z.string().nullable(),
  approved_by: z.string().nullable(),
  comment: z.string().nullable(),
  company_id: z.string(),
  created_at: z.string().nullable(),
  customer_id: z.string(),
  employee_id: z.string().nullable(),
  id: z.string(),
  is_approved: z.unknown().nullable(),
  is_public: z.unknown(),
  rating: z.number(),
  service_id: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const AddReviewRequestSchema = z.object({
  appointment_id: z.string().nullable().optional(),
  approved_at: z.string().nullable().optional(),
  approved_by: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  customer_id: z.string(),
  employee_id: z.string().nullable().optional(),
  id: z.string().optional(),
  is_approved: z.unknown().nullable().optional(),
  is_public: z.unknown().optional(),
  rating: z.number(),
  service_id: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateReviewRequestSchema = z
  .object({
    appointment_id: z.string().nullable().optional(),
    approved_at: z.string().nullable().optional(),
    approved_by: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    customer_id: z.string().optional(),
    employee_id: z.string().nullable().optional(),
    is_approved: z.unknown().nullable().optional(),
    is_public: z.unknown().optional(),
    rating: z.number().optional(),
    service_id: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const ReviewsMetaSchema = z.object({
  id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable(),
  review_id: z.string(),
});

export const AddReviewsMetaRequestSchema = z.object({
  id: z.string().optional(),
  meta_key: z.string(),
  meta_value: z.string().nullable().optional(),
  review_id: z.string(),
});

export const UpdateReviewsMetaRequestSchema = z
  .object({
    meta_key: z.string().optional(),
    meta_value: z.string().nullable().optional(),
    review_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const ServiceMetaSchema = z.object({
  company_id: z.string().nullable(),
  created_at: z.string().nullable(),
  employee_id: z.string().nullable(),
  id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable(),
  service_id: z.string(),
  updated_at: z.string().nullable(),
});

export const AddServiceMetaRequestSchema = z.object({
  company_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  employee_id: z.string().nullable().optional(),
  id: z.string().optional(),
  meta_key: z.string(),
  meta_value: z.string().nullable().optional(),
  service_id: z.string(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateServiceMetaRequestSchema = z
  .object({
    company_id: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    employee_id: z.string().nullable().optional(),
    meta_key: z.string().optional(),
    meta_value: z.string().nullable().optional(),
    service_id: z.string().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const ServiceSchema = z.object({
  content: z.string().nullable(),
  created_at: z.string().nullable(),
  description: z.string().nullable(),
  id: z.string(),
  image: z.string().nullable(),
  slug: z.string().nullable(),
  status: z.string().nullable(),
  title: z.string(),
  updated_at: z.string().nullable(),
});

export const AddServiceRequestSchema = z.object({
  content: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  id: z.string().optional(),
  image: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  title: z.string(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateServiceRequestSchema = z
  .object({
    content: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    title: z.string().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const WaitlistSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable(),
  customer_id: z.string(),
  employee_id: z.string(),
  id: z.string(),
  note: z.string().nullable(),
  preferred_end_date: z.string(),
  preferred_end_time: z.string().nullable(),
  preferred_start_date: z.string(),
  preferred_start_time: z.string().nullable(),
  priority_score: z.number(),
  service_id: z.string().nullable(),
  status: z.enum(['pending', 'cancelled', 'expired', 'notified', 'converted']),
  updated_at: z.string().nullable(),
});

export const AddWaitlistRequestSchema = z.object({
  company_id: z.string(),
  created_at: z.string().nullable().optional(),
  customer_id: z.string(),
  employee_id: z.string(),
  id: z.string().optional(),
  note: z.string().nullable().optional(),
  preferred_end_date: z.string(),
  preferred_end_time: z.string().nullable().optional(),
  preferred_start_date: z.string(),
  preferred_start_time: z.string().nullable().optional(),
  priority_score: z.number().optional(),
  service_id: z.string().nullable().optional(),
  status: z
    .enum(['pending', 'cancelled', 'expired', 'notified', 'converted'])
    .optional(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateWaitlistRequestSchema = z
  .object({
    company_id: z.string().optional(),
    created_at: z.string().nullable().optional(),
    customer_id: z.string().optional(),
    employee_id: z.string().optional(),
    note: z.string().nullable().optional(),
    preferred_end_date: z.string().optional(),
    preferred_end_time: z.string().nullable().optional(),
    preferred_start_date: z.string().optional(),
    preferred_start_time: z.string().nullable().optional(),
    priority_score: z.number().optional(),
    service_id: z.string().nullable().optional(),
    status: z
      .enum(['pending', 'cancelled', 'expired', 'notified', 'converted'])
      .optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const WaitlistMetaSchema = z.object({
  id: z.string(),
  meta_key: z.string(),
  meta_value: z.string().nullable(),
  waitlist_id: z.string(),
});

export const AddWaitlistMetaRequestSchema = z.object({
  id: z.string().optional(),
  meta_key: z.string(),
  meta_value: z.string().nullable().optional(),
  waitlist_id: z.string(),
});

export const UpdateWaitlistMetaRequestSchema = z
  .object({
    meta_key: z.string().optional(),
    meta_value: z.string().nullable().optional(),
    waitlist_id: z.string().optional(),
  })
  .extend({ id: z.string() });

export const WhatsappMessageSchema = z.object({
  appointment_id: z.string().nullable(),
  company_id: z.string().nullable(),
  conversation_id: z.string().nullable(),
  created_at: z.string().nullable(),
  customer_response: z.string().nullable(),
  delivered_at: z.string().nullable(),
  direction: z.enum(['outbound', 'inbound']),
  error_message: z.string().nullable(),
  external_id: z.string().nullable(),
  id: z.string(),
  message_content: z.string(),
  message_template: z.string().nullable(),
  message_type: z.enum([
    'other',
    'appointment_reminder',
    'organization_invite',
    'appointment_confirmation',
    'employee_notification',
    'employee_reminder',
    'ai_conversation',
    'information',
    'promotional',
    'support',
  ]),
  metadata: z.unknown().nullable(),
  notification_id: z.string().nullable(),
  parent_message_id: z.string().nullable(),
  read_at: z.string().nullable(),
  recipient_customer_id: z.string().nullable(),
  recipient_id: z.string().nullable(),
  recipient_phone: z.string().nullable(),
  replied_at: z.string().nullable(),
  requires_response: z.unknown().nullable(),
  response_status: z
    .enum([
      'confirmed',
      'rejected',
      'completed',
      'no_response',
      'pending_action',
    ])
    .nullable(),
  retry_count: z.number().nullable(),
  sender_customer_id: z.string().nullable(),
  sender_id: z.string().nullable(),
  sender_phone: z.string().nullable(),
  sent_at: z.string().nullable(),
  status: z
    .enum(['pending', 'failed', 'sent', 'delivered', 'read', 'replied'])
    .nullable(),
  updated_at: z.string().nullable(),
});

export const AddWhatsappMessageRequestSchema = z.object({
  appointment_id: z.string().nullable().optional(),
  company_id: z.string().nullable().optional(),
  conversation_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  customer_response: z.string().nullable().optional(),
  delivered_at: z.string().nullable().optional(),
  direction: z.enum(['outbound', 'inbound']).optional(),
  error_message: z.string().nullable().optional(),
  external_id: z.string().nullable().optional(),
  id: z.string().optional(),
  message_content: z.string(),
  message_template: z.string().nullable().optional(),
  message_type: z.enum([
    'other',
    'appointment_reminder',
    'organization_invite',
    'appointment_confirmation',
    'employee_notification',
    'employee_reminder',
    'ai_conversation',
    'information',
    'promotional',
    'support',
  ]),
  metadata: z.unknown().nullable().optional(),
  notification_id: z.string().nullable().optional(),
  parent_message_id: z.string().nullable().optional(),
  read_at: z.string().nullable().optional(),
  recipient_customer_id: z.string().nullable().optional(),
  recipient_id: z.string().nullable().optional(),
  recipient_phone: z.string().nullable().optional(),
  replied_at: z.string().nullable().optional(),
  requires_response: z.unknown().nullable().optional(),
  response_status: z
    .enum([
      'confirmed',
      'rejected',
      'completed',
      'no_response',
      'pending_action',
    ])
    .nullable()
    .optional(),
  retry_count: z.number().nullable().optional(),
  sender_customer_id: z.string().nullable().optional(),
  sender_id: z.string().nullable().optional(),
  sender_phone: z.string().nullable().optional(),
  sent_at: z.string().nullable().optional(),
  status: z
    .enum(['pending', 'failed', 'sent', 'delivered', 'read', 'replied'])
    .nullable()
    .optional(),
  updated_at: z.string().nullable().optional(),
});

export const UpdateWhatsappMessageRequestSchema = z
  .object({
    appointment_id: z.string().nullable().optional(),
    company_id: z.string().nullable().optional(),
    conversation_id: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    customer_response: z.string().nullable().optional(),
    delivered_at: z.string().nullable().optional(),
    direction: z.enum(['outbound', 'inbound']).optional(),
    error_message: z.string().nullable().optional(),
    external_id: z.string().nullable().optional(),
    message_content: z.string().optional(),
    message_template: z.string().nullable().optional(),
    message_type: z
      .enum([
        'other',
        'appointment_reminder',
        'organization_invite',
        'appointment_confirmation',
        'employee_notification',
        'employee_reminder',
        'ai_conversation',
        'information',
        'promotional',
        'support',
      ])
      .optional(),
    metadata: z.unknown().nullable().optional(),
    notification_id: z.string().nullable().optional(),
    parent_message_id: z.string().nullable().optional(),
    read_at: z.string().nullable().optional(),
    recipient_customer_id: z.string().nullable().optional(),
    recipient_id: z.string().nullable().optional(),
    recipient_phone: z.string().nullable().optional(),
    replied_at: z.string().nullable().optional(),
    requires_response: z.unknown().nullable().optional(),
    response_status: z
      .enum([
        'confirmed',
        'rejected',
        'completed',
        'no_response',
        'pending_action',
      ])
      .nullable()
      .optional(),
    retry_count: z.number().nullable().optional(),
    sender_customer_id: z.string().nullable().optional(),
    sender_id: z.string().nullable().optional(),
    sender_phone: z.string().nullable().optional(),
    sent_at: z.string().nullable().optional(),
    status: z
      .enum(['pending', 'failed', 'sent', 'delivered', 'read', 'replied'])
      .nullable()
      .optional(),
    updated_at: z.string().nullable().optional(),
  })
  .extend({ id: z.string() });

export const AddCustomerToCompanyArgsSchema = z.object({
  p_company_id: z.string(),
  p_customer_id: z.string(),
});

export const AddCustomerToCompanyReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export const AutoExpireInvitesArgsSchema = z.object({});

export const AutoExpireInvitesReturnsSchema = z.number().nullable().nullable();

export const CreateAuditLogArgsSchema = z.object({
  p_action: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  p_actor_id: z.string().optional(),
  p_company_id: z.string().optional(),
  p_ip_address: z.unknown().optional(),
  p_metadata: z.unknown().nullable().optional(),
  p_new_values: z.unknown().nullable().optional(),
  p_old_values: z.unknown().nullable().optional(),
  p_record_id: z.string().optional(),
  p_table_name: z.string(),
  p_user_agent: z.string().optional(),
});

export const CreateAuditLogReturnsSchema = z.string().nullable().nullable();

export const CreateCustomerProfileArgsSchema = z.object({
  p_company_id: z.string(),
  p_email: z.string().optional(),
  p_first_name: z.string().optional(),
  p_last_name: z.string().optional(),
  p_phone: z.string(),
});

export const CreateCustomerProfileReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export const CreateNotificationArgsSchema = z.object({
  p_company_id: z.string().optional(),
  p_customer_id: z.string().optional(),
  p_message: z.string().optional(),
  p_metadata: z.unknown().nullable().optional(),
  p_related_id: z.string().optional(),
  p_related_type: z.string().optional(),
  p_title: z.string().optional(),
  p_type: z
    .enum([
      'appointment_created',
      'appointment_confirmed',
      'appointment_cancelled',
      'appointment_updated',
      'appointment_reminder',
      'appointment_completed',
      'appointment_no_show',
      'organization_invite',
      'general',
    ])
    .optional(),
  p_user_id: z.string().optional(),
});

export const CreateNotificationReturnsSchema = z.string().nullable().nullable();

export const CreateOrganizationInviteArgsSchema = z.object({
  p_company_id: z.string(),
  p_email: z.string().optional(),
  p_expires_in_days: z.number().optional(),
  p_invited_by: z.string(),
  p_metadata: z.unknown().nullable().optional(),
  p_phone: z.string().optional(),
  p_role: z.enum([
    'owner',
    'admin',
    'accountant',
    'manager',
    'staff',
    'assistant',
  ]),
  p_user_id: z.string().optional(),
});

export const CreateOrganizationInviteReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export const CreateWhatsappMessageArgsSchema = z.object({});

export const CreateWhatsappMessageReturnsSchema = z.unknown().nullable();

export const GenerateInviteCodeArgsSchema = z.object({});

export const GenerateInviteCodeReturnsSchema = z.string().nullable().nullable();

export const GetAccessibleCompaniesArgsSchema = z.object({
  p_company_id: z.string(),
});

export const GetAccessibleCompaniesReturnsSchema = z
  .unknown()
  .nullable()
  .nullable();

export const GetCompanyCustomersArgsSchema = z.object({
  p_company_id: z.string(),
});

export const GetCompanyCustomersReturnsSchema = z
  .array(
    z.object({
      avatar_url: z.string().nullable(),
      company_id: z.string().nullable(),
      customer_id: z.string().nullable(),
      email: z.string().nullable(),
      first_name: z.string().nullable(),
      id: z.string().nullable(),
      last_name: z.string().nullable(),
      phone: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const GetCustomerCompaniesArgsSchema = z.object({
  p_customer_id: z.string(),
});

export const GetCustomerCompaniesReturnsSchema = z
  .array(
    z.object({
      company_id: z.string().nullable(),
      company_name: z.string().nullable(),
      customer_id: z.string().nullable(),
      id: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const GetEmployeeCompanyScheduleArgsSchema = z.object({
  p_company_id: z.string(),
  p_employee_id: z.string(),
  p_end_date: z.string().optional(),
  p_start_date: z.string().optional(),
});

export const GetEmployeeCompanyScheduleReturnsSchema = z
  .unknown()
  .nullable()
  .nullable();

export const GetEmployeeShiftArgsSchema = z.object({
  p_company_id: z.string().optional(),
  p_employee_id: z.string().optional(),
  p_include_inactive: z.unknown().optional(),
});

export const GetEmployeeShiftReturnsSchema = z
  .array(
    z.object({
      company_id: z.string().nullable(),
      company_name: z.string().nullable(),
      employee_email: z.string().nullable(),
      employee_id: z.string().nullable(),
      employee_name: z.string().nullable(),
      shift_created_at: z.string().nullable(),
      shift_data: z.unknown().nullable(),
      shift_description: z.string().nullable(),
      shift_id: z.string().nullable(),
      shift_is_active: z.unknown(),
      shift_name: z.string().nullable(),
      shift_status: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const GetMyCompanyIdsArgsSchema = z.object({});

export const GetMyCompanyIdsReturnsSchema = z
  .array(z.object({ company_id: z.string().nullable() }))
  .nullable()
  .nullable();

export const GetOrganizationInvitesArgsSchema = z.object({
  p_company_id: z.string().optional(),
  p_phone: z.string().optional(),
  p_status: z
    .enum(['pending', 'rejected', 'cancelled', 'accepted', 'expired'])
    .optional(),
  p_user_id: z.string().optional(),
});

export const GetOrganizationInvitesReturnsSchema = z
  .array(
    z.object({
      accepted_at: z.string().nullable(),
      cancelled_at: z.string().nullable(),
      company_id: z.string().nullable(),
      company_name: z.string().nullable(),
      created_at: z.string().nullable(),
      email: z.string().nullable(),
      expires_at: z.string().nullable(),
      id: z.string().nullable(),
      invite_code: z.string().nullable(),
      invited_by: z.string().nullable(),
      inviter_email: z.string().nullable(),
      inviter_name: z.string().nullable(),
      is_expired: z.unknown(),
      metadata: z.unknown().nullable(),
      phone: z.string().nullable(),
      rejected_at: z.string().nullable(),
      role: z.enum([
        'owner',
        'admin',
        'accountant',
        'manager',
        'staff',
        'assistant',
      ]),
      status: z.enum([
        'pending',
        'rejected',
        'cancelled',
        'accepted',
        'expired',
      ]),
      updated_at: z.string().nullable(),
      user_email: z.string().nullable(),
      user_id: z.string().nullable(),
      user_name: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const GetShiftScheduleForDayArgsSchema = z.object({
  p_company_id: z.string(),
  p_day: z.string(),
  p_employee_id: z.string(),
});

export const GetShiftScheduleForDayReturnsSchema = z
  .array(
    z.object({
      day: z.string().nullable(),
      end_time: z.string().nullable(),
      shift_name: z.string().nullable(),
      start_time: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const GetStaffWithServicesArgsSchema = z.object({
  p_company_id: z.string(),
});

export const GetStaffWithServicesReturnsSchema = z
  .array(
    z.object({
      assigned_services: z.unknown().nullable(),
      avatar_url: z.string().nullable(),
      email: z.string().nullable(),
      first_name: z.string().nullable(),
      is_active: z.unknown(),
      joined_at: z.string().nullable(),
      last_name: z.string().nullable(),
      member_id: z.string().nullable(),
      phone: z.string().nullable(),
      role: z.enum([
        'owner',
        'admin',
        'accountant',
        'manager',
        'staff',
        'assistant',
      ]),
      shift_meta_id: z.string().nullable(),
      user_id: z.string().nullable(),
      working_hours_group_id: z.string().nullable(),
      working_hours_group_name: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const GetUserCompaniesArgsSchema = z.object({});

export const GetUserCompaniesReturnsSchema = z
  .array(
    z.object({
      company_id: z.string().nullable(),
      company_name: z.string().nullable(),
      parent_company_id: z.string().nullable(),
      role: z.enum([
        'owner',
        'admin',
        'accountant',
        'manager',
        'staff',
        'assistant',
      ]),
    })
  )
  .nullable()
  .nullable();

export const GetWaitlistByEmployeeArgsSchema = z.object({
  p_employee_id: z.string(),
  p_status: z
    .enum(['pending', 'cancelled', 'expired', 'notified', 'converted'])
    .optional(),
});

export const GetWaitlistByEmployeeReturnsSchema = z
  .array(
    z.object({
      company_id: z.string().nullable(),
      created_at: z.string().nullable(),
      customer_id: z.string().nullable(),
      id: z.string().nullable(),
      note: z.string().nullable(),
      preferred_end_date: z.string().nullable(),
      preferred_end_time: z.string().nullable(),
      preferred_start_date: z.string().nullable(),
      preferred_start_time: z.string().nullable(),
      priority_score: z.number().nullable(),
      service_id: z.string().nullable(),
      status: z.enum([
        'pending',
        'cancelled',
        'expired',
        'notified',
        'converted',
      ]),
      updated_at: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const GetWaitlistByPriorityArgsSchema = z.object({
  p_employee_id: z.string(),
});

export const GetWaitlistByPriorityReturnsSchema = z
  .array(
    z.object({
      company_id: z.string().nullable(),
      created_at: z.string().nullable(),
      customer_id: z.string().nullable(),
      id: z.string().nullable(),
      note: z.string().nullable(),
      preferred_end_date: z.string().nullable(),
      preferred_end_time: z.string().nullable(),
      preferred_start_date: z.string().nullable(),
      preferred_start_time: z.string().nullable(),
      priority_score: z.number().nullable(),
      service_id: z.string().nullable(),
      status: z.enum([
        'pending',
        'cancelled',
        'expired',
        'notified',
        'converted',
      ]),
      updated_at: z.string().nullable(),
    })
  )
  .nullable()
  .nullable();

export const HandleWhatsappResponseArgsSchema = z.object({
  p_company_id: z.string().optional(),
  p_conversation_id: z.string().optional(),
  p_external_id: z.string(),
  p_message_content: z.string(),
  p_metadata: z.unknown().nullable().optional(),
  p_parent_message_id: z.string().optional(),
  p_sender_id: z.string().optional(),
  p_sender_phone: z.string().optional(),
});

export const HandleWhatsappResponseReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export const IsEmployeeArgsSchema = z.object({
  user_uuid: z.string(),
});

export const IsEmployeeReturnsSchema = z.unknown().nullable();

export const LoginCheckArgsSchema = z.object({});

export const LoginCheckReturnsSchema = z
  .array(
    z.object({
      company_id: z.string().nullable(),
      has_access: z.unknown(),
      is_active: z.unknown(),
      is_employee: z.unknown(),
      parent_company_id: z.string().nullable(),
      role: z.enum([
        'owner',
        'admin',
        'accountant',
        'manager',
        'staff',
        'assistant',
      ]),
    })
  )
  .nullable()
  .nullable();

export const MutationAcceptOrganizationInviteArgsSchema = z.object({
  p_invite_code: z.string().optional(),
  p_invite_id: z.string().optional(),
  p_user_id: z.string(),
});

export const MutationAcceptOrganizationInviteReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export const MutationCancelOrganizationInviteArgsSchema = z.object({
  p_cancelled_by: z.string(),
  p_invite_id: z.string(),
});

export const MutationCancelOrganizationInviteReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export const MutationRejectOrganizationInviteArgsSchema = z.object({
  p_invite_code: z.string().optional(),
  p_invite_id: z.string().optional(),
  p_user_id: z.string().optional(),
});

export const MutationRejectOrganizationInviteReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export const SetWhatsappMessageExternalIdArgsSchema = z.object({
  p_external_id: z.string(),
  p_message_id: z.string(),
});

export const SetWhatsappMessageExternalIdReturnsSchema = z
  .undefined()
  .nullable();

export const UpdateProfileCompanyArgsSchema = z.object({
  p_company_id: z.string(),
});

export const UpdateProfileCompanyReturnsSchema = z.undefined().nullable();

export const UpdateWhatsappMessageStatusArgsSchema = z.object({
  p_error_message: z.string().optional(),
  p_external_id: z.string(),
  p_status: z.enum([
    'pending',
    'failed',
    'sent',
    'delivered',
    'read',
    'replied',
  ]),
});

export const UpdateWhatsappMessageStatusReturnsSchema = z
  .string()
  .nullable()
  .nullable();

export type AppRole = z.infer<typeof AppRoleSchema>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type AttachmentRecordType = z.infer<typeof AttachmentRecordTypeSchema>;
export type AuditAction = z.infer<typeof AuditActionSchema>;
export type Currency = z.infer<typeof CurrencySchema>;
export type InviteStatus = z.infer<typeof InviteStatusSchema>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;
export type InvoiceType = z.infer<typeof InvoiceTypeSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type ProfileType = z.infer<typeof ProfileTypeSchema>;
export type WaitlistStatus = z.infer<typeof WaitlistStatusSchema>;
export type WhatsappMessageDirection = z.infer<
  typeof WhatsappMessageDirectionSchema
>;
export type WhatsappMessageStatus = z.infer<typeof WhatsappMessageStatusSchema>;
export type WhatsappMessageType = z.infer<typeof WhatsappMessageTypeSchema>;
export type WhatsappResponseStatus = z.infer<
  typeof WhatsappResponseStatusSchema
>;
export type AppointmentService = z.infer<typeof AppointmentServiceSchema>;
export type AddAppointmentServiceRequest = z.infer<
  typeof AddAppointmentServiceRequestSchema
>;
export type UpdateAppointmentServiceRequest = z.infer<
  typeof UpdateAppointmentServiceRequestSchema
>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type AddAppointmentRequest = z.infer<typeof AddAppointmentRequestSchema>;
export type UpdateAppointmentRequest = z.infer<
  typeof UpdateAppointmentRequestSchema
>;
export type AssistantAssignment = z.infer<typeof AssistantAssignmentSchema>;
export type AddAssistantAssignmentRequest = z.infer<
  typeof AddAssistantAssignmentRequestSchema
>;
export type UpdateAssistantAssignmentRequest = z.infer<
  typeof UpdateAssistantAssignmentRequestSchema
>;
export type Attachment = z.infer<typeof AttachmentSchema>;
export type AddAttachmentRequest = z.infer<typeof AddAttachmentRequestSchema>;
export type UpdateAttachmentRequest = z.infer<
  typeof UpdateAttachmentRequestSchema
>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AddAuditLogRequest = z.infer<typeof AddAuditLogRequestSchema>;
export type UpdateAuditLogRequest = z.infer<typeof UpdateAuditLogRequestSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type AddCompanyRequest = z.infer<typeof AddCompanyRequestSchema>;
export type UpdateCompanyRequest = z.infer<typeof UpdateCompanyRequestSchema>;
export type CompanyMeta = z.infer<typeof CompanyMetaSchema>;
export type AddCompanyMetaRequest = z.infer<typeof AddCompanyMetaRequestSchema>;
export type UpdateCompanyMetaRequest = z.infer<
  typeof UpdateCompanyMetaRequestSchema
>;
export type CustomerCompanyRelation = z.infer<
  typeof CustomerCompanyRelationSchema
>;
export type AddCustomerCompanyRelationRequest = z.infer<
  typeof AddCustomerCompanyRelationRequestSchema
>;
export type UpdateCustomerCompanyRelationRequest = z.infer<
  typeof UpdateCustomerCompanyRelationRequestSchema
>;
export type Customer = z.infer<typeof CustomerSchema>;
export type AddCustomerRequest = z.infer<typeof AddCustomerRequestSchema>;
export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequestSchema>;
export type EmployeeServiceRelation = z.infer<
  typeof EmployeeServiceRelationSchema
>;
export type AddEmployeeServiceRelationRequest = z.infer<
  typeof AddEmployeeServiceRelationRequestSchema
>;
export type UpdateEmployeeServiceRelationRequest = z.infer<
  typeof UpdateEmployeeServiceRelationRequestSchema
>;
export type EmployeeWorkingLeave = z.infer<typeof EmployeeWorkingLeaveSchema>;
export type AddEmployeeWorkingLeaveRequest = z.infer<
  typeof AddEmployeeWorkingLeaveRequestSchema
>;
export type UpdateEmployeeWorkingLeaveRequest = z.infer<
  typeof UpdateEmployeeWorkingLeaveRequestSchema
>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type AddInvoiceRequest = z.infer<typeof AddInvoiceRequestSchema>;
export type UpdateInvoiceRequest = z.infer<typeof UpdateInvoiceRequestSchema>;
export type InvoicesMeta = z.infer<typeof InvoicesMetaSchema>;
export type AddInvoicesMetaRequest = z.infer<
  typeof AddInvoicesMetaRequestSchema
>;
export type UpdateInvoicesMetaRequest = z.infer<
  typeof UpdateInvoicesMetaRequestSchema
>;
export type Notification = z.infer<typeof NotificationSchema>;
export type AddNotificationRequest = z.infer<
  typeof AddNotificationRequestSchema
>;
export type UpdateNotificationRequest = z.infer<
  typeof UpdateNotificationRequestSchema
>;
export type OrganizationInvite = z.infer<typeof OrganizationInviteSchema>;
export type AddOrganizationInviteRequest = z.infer<
  typeof AddOrganizationInviteRequestSchema
>;
export type UpdateOrganizationInviteRequest = z.infer<
  typeof UpdateOrganizationInviteRequestSchema
>;
export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>;
export type AddOrganizationMemberRequest = z.infer<
  typeof AddOrganizationMemberRequestSchema
>;
export type UpdateOrganizationMemberRequest = z.infer<
  typeof UpdateOrganizationMemberRequestSchema
>;
export type Payment = z.infer<typeof PaymentSchema>;
export type AddPaymentRequest = z.infer<typeof AddPaymentRequestSchema>;
export type UpdatePaymentRequest = z.infer<typeof UpdatePaymentRequestSchema>;
export type PaymentsMeta = z.infer<typeof PaymentsMetaSchema>;
export type AddPaymentsMetaRequest = z.infer<
  typeof AddPaymentsMetaRequestSchema
>;
export type UpdatePaymentsMetaRequest = z.infer<
  typeof UpdatePaymentsMetaRequestSchema
>;
export type ProfileMeta = z.infer<typeof ProfileMetaSchema>;
export type AddProfileMetaRequest = z.infer<typeof AddProfileMetaRequestSchema>;
export type UpdateProfileMetaRequest = z.infer<
  typeof UpdateProfileMetaRequestSchema
>;
export type Profile = z.infer<typeof ProfileSchema>;
export type AddProfileRequest = z.infer<typeof AddProfileRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type AddReviewRequest = z.infer<typeof AddReviewRequestSchema>;
export type UpdateReviewRequest = z.infer<typeof UpdateReviewRequestSchema>;
export type ReviewsMeta = z.infer<typeof ReviewsMetaSchema>;
export type AddReviewsMetaRequest = z.infer<typeof AddReviewsMetaRequestSchema>;
export type UpdateReviewsMetaRequest = z.infer<
  typeof UpdateReviewsMetaRequestSchema
>;
export type ServiceMeta = z.infer<typeof ServiceMetaSchema>;
export type AddServiceMetaRequest = z.infer<typeof AddServiceMetaRequestSchema>;
export type UpdateServiceMetaRequest = z.infer<
  typeof UpdateServiceMetaRequestSchema
>;
export type Service = z.infer<typeof ServiceSchema>;
export type AddServiceRequest = z.infer<typeof AddServiceRequestSchema>;
export type UpdateServiceRequest = z.infer<typeof UpdateServiceRequestSchema>;
export type Waitlist = z.infer<typeof WaitlistSchema>;
export type AddWaitlistRequest = z.infer<typeof AddWaitlistRequestSchema>;
export type UpdateWaitlistRequest = z.infer<typeof UpdateWaitlistRequestSchema>;
export type WaitlistMeta = z.infer<typeof WaitlistMetaSchema>;
export type AddWaitlistMetaRequest = z.infer<
  typeof AddWaitlistMetaRequestSchema
>;
export type UpdateWaitlistMetaRequest = z.infer<
  typeof UpdateWaitlistMetaRequestSchema
>;
export type WhatsappMessage = z.infer<typeof WhatsappMessageSchema>;
export type AddWhatsappMessageRequest = z.infer<
  typeof AddWhatsappMessageRequestSchema
>;
export type UpdateWhatsappMessageRequest = z.infer<
  typeof UpdateWhatsappMessageRequestSchema
>;
export type AddCustomerToCompanyArgs = z.infer<
  typeof AddCustomerToCompanyArgsSchema
>;
export type AddCustomerToCompanyReturns = z.infer<
  typeof AddCustomerToCompanyReturnsSchema
>;
export type AutoExpireInvitesArgs = z.infer<typeof AutoExpireInvitesArgsSchema>;
export type AutoExpireInvitesReturns = z.infer<
  typeof AutoExpireInvitesReturnsSchema
>;
export type CreateAuditLogArgs = z.infer<typeof CreateAuditLogArgsSchema>;
export type CreateAuditLogReturns = z.infer<typeof CreateAuditLogReturnsSchema>;
export type CreateCustomerProfileArgs = z.infer<
  typeof CreateCustomerProfileArgsSchema
>;
export type CreateCustomerProfileReturns = z.infer<
  typeof CreateCustomerProfileReturnsSchema
>;
export type CreateNotificationArgs = z.infer<
  typeof CreateNotificationArgsSchema
>;
export type CreateNotificationReturns = z.infer<
  typeof CreateNotificationReturnsSchema
>;
export type CreateOrganizationInviteArgs = z.infer<
  typeof CreateOrganizationInviteArgsSchema
>;
export type CreateOrganizationInviteReturns = z.infer<
  typeof CreateOrganizationInviteReturnsSchema
>;
export type CreateWhatsappMessageArgs = z.infer<
  typeof CreateWhatsappMessageArgsSchema
>;
export type CreateWhatsappMessageReturns = z.infer<
  typeof CreateWhatsappMessageReturnsSchema
>;
export type GenerateInviteCodeArgs = z.infer<
  typeof GenerateInviteCodeArgsSchema
>;
export type GenerateInviteCodeReturns = z.infer<
  typeof GenerateInviteCodeReturnsSchema
>;
export type GetAccessibleCompaniesArgs = z.infer<
  typeof GetAccessibleCompaniesArgsSchema
>;
export type GetAccessibleCompaniesReturns = z.infer<
  typeof GetAccessibleCompaniesReturnsSchema
>;
export type GetCompanyCustomersArgs = z.infer<
  typeof GetCompanyCustomersArgsSchema
>;
export type GetCompanyCustomersReturns = z.infer<
  typeof GetCompanyCustomersReturnsSchema
>;
export type GetCustomerCompaniesArgs = z.infer<
  typeof GetCustomerCompaniesArgsSchema
>;
export type GetCustomerCompaniesReturns = z.infer<
  typeof GetCustomerCompaniesReturnsSchema
>;
export type GetEmployeeCompanyScheduleArgs = z.infer<
  typeof GetEmployeeCompanyScheduleArgsSchema
>;
export type GetEmployeeCompanyScheduleReturns = z.infer<
  typeof GetEmployeeCompanyScheduleReturnsSchema
>;
export type GetEmployeeShiftArgs = z.infer<typeof GetEmployeeShiftArgsSchema>;
export type GetEmployeeShiftReturns = z.infer<
  typeof GetEmployeeShiftReturnsSchema
>;
export type GetMyCompanyIdsArgs = z.infer<typeof GetMyCompanyIdsArgsSchema>;
export type GetMyCompanyIdsReturns = z.infer<
  typeof GetMyCompanyIdsReturnsSchema
>;
export type GetOrganizationInvitesArgs = z.infer<
  typeof GetOrganizationInvitesArgsSchema
>;
export type GetOrganizationInvitesReturns = z.infer<
  typeof GetOrganizationInvitesReturnsSchema
>;
export type GetShiftScheduleForDayArgs = z.infer<
  typeof GetShiftScheduleForDayArgsSchema
>;
export type GetShiftScheduleForDayReturns = z.infer<
  typeof GetShiftScheduleForDayReturnsSchema
>;
export type GetStaffWithServicesArgs = z.infer<
  typeof GetStaffWithServicesArgsSchema
>;
export type GetStaffWithServicesReturns = z.infer<
  typeof GetStaffWithServicesReturnsSchema
>;
export type GetUserCompaniesArgs = z.infer<typeof GetUserCompaniesArgsSchema>;
export type GetUserCompaniesReturns = z.infer<
  typeof GetUserCompaniesReturnsSchema
>;
export type GetWaitlistByEmployeeArgs = z.infer<
  typeof GetWaitlistByEmployeeArgsSchema
>;
export type GetWaitlistByEmployeeReturns = z.infer<
  typeof GetWaitlistByEmployeeReturnsSchema
>;
export type GetWaitlistByPriorityArgs = z.infer<
  typeof GetWaitlistByPriorityArgsSchema
>;
export type GetWaitlistByPriorityReturns = z.infer<
  typeof GetWaitlistByPriorityReturnsSchema
>;
export type HandleWhatsappResponseArgs = z.infer<
  typeof HandleWhatsappResponseArgsSchema
>;
export type HandleWhatsappResponseReturns = z.infer<
  typeof HandleWhatsappResponseReturnsSchema
>;
export type IsEmployeeArgs = z.infer<typeof IsEmployeeArgsSchema>;
export type IsEmployeeReturns = z.infer<typeof IsEmployeeReturnsSchema>;
export type LoginCheckArgs = z.infer<typeof LoginCheckArgsSchema>;
export type LoginCheckReturns = z.infer<typeof LoginCheckReturnsSchema>;
export type MutationAcceptOrganizationInviteArgs = z.infer<
  typeof MutationAcceptOrganizationInviteArgsSchema
>;
export type MutationAcceptOrganizationInviteReturns = z.infer<
  typeof MutationAcceptOrganizationInviteReturnsSchema
>;
export type MutationCancelOrganizationInviteArgs = z.infer<
  typeof MutationCancelOrganizationInviteArgsSchema
>;
export type MutationCancelOrganizationInviteReturns = z.infer<
  typeof MutationCancelOrganizationInviteReturnsSchema
>;
export type MutationRejectOrganizationInviteArgs = z.infer<
  typeof MutationRejectOrganizationInviteArgsSchema
>;
export type MutationRejectOrganizationInviteReturns = z.infer<
  typeof MutationRejectOrganizationInviteReturnsSchema
>;
export type SetWhatsappMessageExternalIdArgs = z.infer<
  typeof SetWhatsappMessageExternalIdArgsSchema
>;
export type SetWhatsappMessageExternalIdReturns = z.infer<
  typeof SetWhatsappMessageExternalIdReturnsSchema
>;
export type UpdateProfileCompanyArgs = z.infer<
  typeof UpdateProfileCompanyArgsSchema
>;
export type UpdateProfileCompanyReturns = z.infer<
  typeof UpdateProfileCompanyReturnsSchema
>;
export type UpdateWhatsappMessageStatusArgs = z.infer<
  typeof UpdateWhatsappMessageStatusArgsSchema
>;
export type UpdateWhatsappMessageStatusReturns = z.infer<
  typeof UpdateWhatsappMessageStatusReturnsSchema
>;

export function useGetAppointmentService(id: string) {
  return useQuery<AppointmentService, Error>({
    queryKey: ['appointment_service', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointment_service')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as AppointmentService;
    },
    enabled: !!id,
  });
}

export function useGetAllAppointmentServices(options?: QueryOptions) {
  return useQuery<PaginatedResponse<AppointmentService>, Error>({
    queryKey: options?.queryKey ?? ['appointment_service', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('appointment_service')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as AppointmentService[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddAppointmentService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddAppointmentServiceRequest) => {
      const result = AddAppointmentServiceRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('appointment_service')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as AppointmentService;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment_service'] });
    },
  });
}

export function useUpdateAppointmentService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateAppointmentServiceRequest) => {
      const result = UpdateAppointmentServiceRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('appointment_service')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as AppointmentService;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment_service'] });
    },
  });
}

export function useDeleteAppointmentService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointment_service')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment_service'] });
    },
  });
}

export function useBulkAddAppointmentServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddAppointmentServiceRequest[]) => {
      const validated: AddAppointmentServiceRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddAppointmentServiceRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('appointment_service')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as AppointmentService[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment_service'] });
    },
  });
}

export function useBulkUpdateAppointmentServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateAppointmentServiceRequest[]) => {
      const results: AppointmentService[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateAppointmentServiceRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('appointment_service')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as AppointmentService);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment_service'] });
    },
  });
}

export function useBulkDeleteAppointmentServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('appointment_service')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment_service'] });
    },
  });
}

export function useGetAppointment(id: string) {
  return useQuery<Appointment, Error>({
    queryKey: ['appointments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Appointment;
    },
    enabled: !!id,
  });
}

export function useGetAllAppointments(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Appointment>, Error>({
    queryKey: options?.queryKey ?? ['appointments', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('appointments')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Appointment[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddAppointmentRequest) => {
      const result = AddAppointmentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('appointments')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateAppointmentRequest) => {
      const result = UpdateAppointmentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('appointments')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useBulkAddAppointments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddAppointmentRequest[]) => {
      const validated: AddAppointmentRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddAppointmentRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('appointments')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Appointment[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useBulkUpdateAppointments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateAppointmentRequest[]) => {
      const results: Appointment[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateAppointmentRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('appointments')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Appointment);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useBulkDeleteAppointments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useGetAssistantAssignment(id: string) {
  return useQuery<AssistantAssignment, Error>({
    queryKey: ['assistant_assignments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assistant_assignments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as AssistantAssignment;
    },
    enabled: !!id,
  });
}

export function useGetAllAssistantAssignments(options?: QueryOptions) {
  return useQuery<PaginatedResponse<AssistantAssignment>, Error>({
    queryKey: options?.queryKey ?? ['assistant_assignments', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('assistant_assignments')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as AssistantAssignment[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddAssistantAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddAssistantAssignmentRequest) => {
      const result = AddAssistantAssignmentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('assistant_assignments')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as AssistantAssignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant_assignments'] });
    },
  });
}

export function useUpdateAssistantAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateAssistantAssignmentRequest) => {
      const result = UpdateAssistantAssignmentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('assistant_assignments')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as AssistantAssignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant_assignments'] });
    },
  });
}

export function useDeleteAssistantAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assistant_assignments')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant_assignments'] });
    },
  });
}

export function useBulkAddAssistantAssignments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddAssistantAssignmentRequest[]) => {
      const validated: AddAssistantAssignmentRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddAssistantAssignmentRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('assistant_assignments')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as AssistantAssignment[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant_assignments'] });
    },
  });
}

export function useBulkUpdateAssistantAssignments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateAssistantAssignmentRequest[]) => {
      const results: AssistantAssignment[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateAssistantAssignmentRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('assistant_assignments')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as AssistantAssignment);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant_assignments'] });
    },
  });
}

export function useBulkDeleteAssistantAssignments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('assistant_assignments')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistant_assignments'] });
    },
  });
}

export function useGetAttachment(id: string) {
  return useQuery<Attachment, Error>({
    queryKey: ['attachments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attachments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Attachment;
    },
    enabled: !!id,
  });
}

export function useGetAllAttachments(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Attachment>, Error>({
    queryKey: options?.queryKey ?? ['attachments', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('attachments')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Attachment[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddAttachmentRequest) => {
      const result = AddAttachmentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('attachments')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Attachment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}

export function useUpdateAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateAttachmentRequest) => {
      const result = UpdateAttachmentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('attachments')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Attachment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attachments')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}

export function useBulkAddAttachments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddAttachmentRequest[]) => {
      const validated: AddAttachmentRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddAttachmentRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('attachments')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Attachment[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}

export function useBulkUpdateAttachments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateAttachmentRequest[]) => {
      const results: Attachment[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateAttachmentRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('attachments')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Attachment);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}

export function useBulkDeleteAttachments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('attachments')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
    },
  });
}

export function useGetAuditLog(id: string) {
  return useQuery<AuditLog, Error>({
    queryKey: ['audit_logs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as AuditLog;
    },
    enabled: !!id,
  });
}

export function useGetAllAuditLogs(options?: QueryOptions) {
  return useQuery<PaginatedResponse<AuditLog>, Error>({
    queryKey: options?.queryKey ?? ['audit_logs', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('audit_logs')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as AuditLog[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddAuditLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddAuditLogRequest) => {
      const result = AddAuditLogRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as AuditLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });
}

export function useUpdateAuditLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateAuditLogRequest) => {
      const result = UpdateAuditLogRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('audit_logs')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as AuditLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });
}

export function useDeleteAuditLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('audit_logs').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });
}

export function useBulkAddAuditLogs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddAuditLogRequest[]) => {
      const validated: AddAuditLogRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddAuditLogRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as AuditLog[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });
}

export function useBulkUpdateAuditLogs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateAuditLogRequest[]) => {
      const results: AuditLog[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateAuditLogRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('audit_logs')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as AuditLog);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });
}

export function useBulkDeleteAuditLogs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('audit_logs')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });
}

export function useGetCompany(id: string) {
  return useQuery<Company, Error>({
    queryKey: ['companies', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Company;
    },
    enabled: !!id,
  });
}

export function useGetAllCompanies(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Company>, Error>({
    queryKey: options?.queryKey ?? ['companies', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('companies')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Company[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddCompanyRequest) => {
      const result = AddCompanyRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('companies')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateCompanyRequest) => {
      const result = UpdateCompanyRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('companies')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useBulkAddCompanies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddCompanyRequest[]) => {
      const validated: AddCompanyRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddCompanyRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('companies')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Company[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useBulkUpdateCompanies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateCompanyRequest[]) => {
      const results: Company[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateCompanyRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('companies')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Company);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useBulkDeleteCompanies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('companies').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
}

export function useGetCompanyMeta(id: string) {
  return useQuery<CompanyMeta, Error>({
    queryKey: ['company_meta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_meta')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as CompanyMeta;
    },
    enabled: !!id,
  });
}

export function useGetAllCompanyMetas(options?: QueryOptions) {
  return useQuery<PaginatedResponse<CompanyMeta>, Error>({
    queryKey: options?.queryKey ?? ['company_meta', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('company_meta')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as CompanyMeta[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddCompanyMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddCompanyMetaRequest) => {
      const result = AddCompanyMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('company_meta')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as CompanyMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_meta'] });
    },
  });
}

export function useUpdateCompanyMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateCompanyMetaRequest) => {
      const result = UpdateCompanyMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('company_meta')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as CompanyMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_meta'] });
    },
  });
}

export function useDeleteCompanyMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_meta')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_meta'] });
    },
  });
}

export function useBulkAddCompanyMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddCompanyMetaRequest[]) => {
      const validated: AddCompanyMetaRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddCompanyMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('company_meta')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as CompanyMeta[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_meta'] });
    },
  });
}

export function useBulkUpdateCompanyMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateCompanyMetaRequest[]) => {
      const results: CompanyMeta[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateCompanyMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('company_meta')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as CompanyMeta);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_meta'] });
    },
  });
}

export function useBulkDeleteCompanyMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('company_meta')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company_meta'] });
    },
  });
}

export function useGetCustomerCompanyRelation(id: string) {
  return useQuery<CustomerCompanyRelation, Error>({
    queryKey: ['customer_company_relations', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_company_relations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as CustomerCompanyRelation;
    },
    enabled: !!id,
  });
}

export function useGetAllCustomerCompanyRelations(options?: QueryOptions) {
  return useQuery<PaginatedResponse<CustomerCompanyRelation>, Error>({
    queryKey: options?.queryKey ?? ['customer_company_relations', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('customer_company_relations')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as CustomerCompanyRelation[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddCustomerCompanyRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddCustomerCompanyRelationRequest) => {
      const result = AddCustomerCompanyRelationRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('customer_company_relations')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as CustomerCompanyRelation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer_company_relations'],
      });
    },
  });
}

export function useUpdateCustomerCompanyRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateCustomerCompanyRelationRequest) => {
      const result = UpdateCustomerCompanyRelationRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('customer_company_relations')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as CustomerCompanyRelation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer_company_relations'],
      });
    },
  });
}

export function useDeleteCustomerCompanyRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customer_company_relations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer_company_relations'],
      });
    },
  });
}

export function useBulkAddCustomerCompanyRelations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddCustomerCompanyRelationRequest[]) => {
      const validated: AddCustomerCompanyRelationRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddCustomerCompanyRelationRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('customer_company_relations')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as CustomerCompanyRelation[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer_company_relations'],
      });
    },
  });
}

export function useBulkUpdateCustomerCompanyRelations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateCustomerCompanyRelationRequest[]) => {
      const results: CustomerCompanyRelation[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateCustomerCompanyRelationRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('customer_company_relations')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as CustomerCompanyRelation);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer_company_relations'],
      });
    },
  });
}

export function useBulkDeleteCustomerCompanyRelations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('customer_company_relations')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['customer_company_relations'],
      });
    },
  });
}

export function useGetCustomer(id: string) {
  return useQuery<Customer, Error>({
    queryKey: ['customers', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Customer;
    },
    enabled: !!id,
  });
}

export function useGetAllCustomers(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Customer>, Error>({
    queryKey: options?.queryKey ?? ['customers', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('customers')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Customer[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddCustomerRequest) => {
      const result = AddCustomerRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('customers')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateCustomerRequest) => {
      const result = UpdateCustomerRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('customers')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useBulkAddCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddCustomerRequest[]) => {
      const validated: AddCustomerRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddCustomerRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('customers')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Customer[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useBulkUpdateCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateCustomerRequest[]) => {
      const results: Customer[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateCustomerRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('customers')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Customer);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useBulkDeleteCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('customers').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useGetEmployeeServiceRelation(id: string) {
  return useQuery<EmployeeServiceRelation, Error>({
    queryKey: ['employee_service_relations', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_service_relations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as EmployeeServiceRelation;
    },
    enabled: !!id,
  });
}

export function useGetAllEmployeeServiceRelations(options?: QueryOptions) {
  return useQuery<PaginatedResponse<EmployeeServiceRelation>, Error>({
    queryKey: options?.queryKey ?? ['employee_service_relations', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('employee_service_relations')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as EmployeeServiceRelation[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddEmployeeServiceRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddEmployeeServiceRelationRequest) => {
      const result = AddEmployeeServiceRelationRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('employee_service_relations')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as EmployeeServiceRelation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee_service_relations'],
      });
    },
  });
}

export function useUpdateEmployeeServiceRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateEmployeeServiceRelationRequest) => {
      const result = UpdateEmployeeServiceRelationRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('employee_service_relations')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as EmployeeServiceRelation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee_service_relations'],
      });
    },
  });
}

export function useDeleteEmployeeServiceRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employee_service_relations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee_service_relations'],
      });
    },
  });
}

export function useBulkAddEmployeeServiceRelations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddEmployeeServiceRelationRequest[]) => {
      const validated: AddEmployeeServiceRelationRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddEmployeeServiceRelationRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('employee_service_relations')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as EmployeeServiceRelation[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee_service_relations'],
      });
    },
  });
}

export function useBulkUpdateEmployeeServiceRelations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateEmployeeServiceRelationRequest[]) => {
      const results: EmployeeServiceRelation[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateEmployeeServiceRelationRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('employee_service_relations')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as EmployeeServiceRelation);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee_service_relations'],
      });
    },
  });
}

export function useBulkDeleteEmployeeServiceRelations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('employee_service_relations')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employee_service_relations'],
      });
    },
  });
}

export function useGetEmployeeWorkingLeave(id: string) {
  return useQuery<EmployeeWorkingLeave, Error>({
    queryKey: ['employee_working_leave', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_working_leave')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as EmployeeWorkingLeave;
    },
    enabled: !!id,
  });
}

export function useGetAllEmployeeWorkingLeaves(options?: QueryOptions) {
  return useQuery<PaginatedResponse<EmployeeWorkingLeave>, Error>({
    queryKey: options?.queryKey ?? ['employee_working_leave', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('employee_working_leave')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as EmployeeWorkingLeave[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddEmployeeWorkingLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddEmployeeWorkingLeaveRequest) => {
      const result = AddEmployeeWorkingLeaveRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('employee_working_leave')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as EmployeeWorkingLeave;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_working_leave'] });
    },
  });
}

export function useUpdateEmployeeWorkingLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateEmployeeWorkingLeaveRequest) => {
      const result = UpdateEmployeeWorkingLeaveRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('employee_working_leave')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as EmployeeWorkingLeave;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_working_leave'] });
    },
  });
}

export function useDeleteEmployeeWorkingLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employee_working_leave')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_working_leave'] });
    },
  });
}

export function useBulkAddEmployeeWorkingLeaves() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddEmployeeWorkingLeaveRequest[]) => {
      const validated: AddEmployeeWorkingLeaveRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddEmployeeWorkingLeaveRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('employee_working_leave')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as EmployeeWorkingLeave[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_working_leave'] });
    },
  });
}

export function useBulkUpdateEmployeeWorkingLeaves() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateEmployeeWorkingLeaveRequest[]) => {
      const results: EmployeeWorkingLeave[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateEmployeeWorkingLeaveRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('employee_working_leave')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as EmployeeWorkingLeave);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_working_leave'] });
    },
  });
}

export function useBulkDeleteEmployeeWorkingLeaves() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('employee_working_leave')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_working_leave'] });
    },
  });
}

export function useGetInvoice(id: string) {
  return useQuery<Invoice, Error>({
    queryKey: ['invoices', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Invoice;
    },
    enabled: !!id,
  });
}

export function useGetAllInvoices(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Invoice>, Error>({
    queryKey: options?.queryKey ?? ['invoices', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('invoices')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Invoice[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddInvoiceRequest) => {
      const result = AddInvoiceRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('invoices')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateInvoiceRequest) => {
      const result = UpdateInvoiceRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('invoices')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useBulkAddInvoices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddInvoiceRequest[]) => {
      const validated: AddInvoiceRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddInvoiceRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('invoices')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Invoice[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useBulkUpdateInvoices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateInvoiceRequest[]) => {
      const results: Invoice[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateInvoiceRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('invoices')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Invoice);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useBulkDeleteInvoices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('invoices').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useGetInvoicesMeta(id: string) {
  return useQuery<InvoicesMeta, Error>({
    queryKey: ['invoices_meta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices_meta')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as InvoicesMeta;
    },
    enabled: !!id,
  });
}

export function useGetAllInvoicesMetas(options?: QueryOptions) {
  return useQuery<PaginatedResponse<InvoicesMeta>, Error>({
    queryKey: options?.queryKey ?? ['invoices_meta', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('invoices_meta')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as InvoicesMeta[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddInvoicesMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddInvoicesMetaRequest) => {
      const result = AddInvoicesMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('invoices_meta')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as InvoicesMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices_meta'] });
    },
  });
}

export function useUpdateInvoicesMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateInvoicesMetaRequest) => {
      const result = UpdateInvoicesMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('invoices_meta')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as InvoicesMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices_meta'] });
    },
  });
}

export function useDeleteInvoicesMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices_meta')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices_meta'] });
    },
  });
}

export function useBulkAddInvoicesMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddInvoicesMetaRequest[]) => {
      const validated: AddInvoicesMetaRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddInvoicesMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('invoices_meta')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as InvoicesMeta[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices_meta'] });
    },
  });
}

export function useBulkUpdateInvoicesMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateInvoicesMetaRequest[]) => {
      const results: InvoicesMeta[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateInvoicesMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('invoices_meta')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as InvoicesMeta);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices_meta'] });
    },
  });
}

export function useBulkDeleteInvoicesMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('invoices_meta')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices_meta'] });
    },
  });
}

export function useGetNotification(id: string) {
  return useQuery<Notification, Error>({
    queryKey: ['notifications', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Notification;
    },
    enabled: !!id,
  });
}

export function useGetAllNotifications(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Notification>, Error>({
    queryKey: options?.queryKey ?? ['notifications', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('notifications')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Notification[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddNotificationRequest) => {
      const result = AddNotificationRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('notifications')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateNotificationRequest) => {
      const result = UpdateNotificationRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('notifications')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useBulkAddNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddNotificationRequest[]) => {
      const validated: AddNotificationRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddNotificationRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('notifications')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Notification[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useBulkUpdateNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateNotificationRequest[]) => {
      const results: Notification[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateNotificationRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('notifications')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Notification);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useBulkDeleteNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useGetOrganizationInvite(id: string) {
  return useQuery<OrganizationInvite, Error>({
    queryKey: ['organization_invites', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_invites')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as OrganizationInvite;
    },
    enabled: !!id,
  });
}

export function useGetAllOrganizationInvites(options?: QueryOptions) {
  return useQuery<PaginatedResponse<OrganizationInvite>, Error>({
    queryKey: options?.queryKey ?? ['organization_invites', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('organization_invites')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as OrganizationInvite[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddOrganizationInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddOrganizationInviteRequest) => {
      const result = AddOrganizationInviteRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('organization_invites')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as OrganizationInvite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_invites'] });
    },
  });
}

export function useUpdateOrganizationInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateOrganizationInviteRequest) => {
      const result = UpdateOrganizationInviteRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('organization_invites')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as OrganizationInvite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_invites'] });
    },
  });
}

export function useDeleteOrganizationInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('organization_invites')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_invites'] });
    },
  });
}

export function useBulkAddOrganizationInvites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddOrganizationInviteRequest[]) => {
      const validated: AddOrganizationInviteRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddOrganizationInviteRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('organization_invites')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as OrganizationInvite[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_invites'] });
    },
  });
}

export function useBulkUpdateOrganizationInvites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateOrganizationInviteRequest[]) => {
      const results: OrganizationInvite[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateOrganizationInviteRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('organization_invites')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as OrganizationInvite);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_invites'] });
    },
  });
}

export function useBulkDeleteOrganizationInvites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('organization_invites')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_invites'] });
    },
  });
}

export function useGetOrganizationMember(id: string) {
  return useQuery<OrganizationMember, Error>({
    queryKey: ['organization_members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as OrganizationMember;
    },
    enabled: !!id,
  });
}

export function useGetAllOrganizationMembers(options?: QueryOptions) {
  return useQuery<PaginatedResponse<OrganizationMember>, Error>({
    queryKey: options?.queryKey ?? ['organization_members', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('organization_members')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as OrganizationMember[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddOrganizationMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddOrganizationMemberRequest) => {
      const result = AddOrganizationMemberRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('organization_members')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as OrganizationMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_members'] });
    },
  });
}

export function useUpdateOrganizationMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateOrganizationMemberRequest) => {
      const result = UpdateOrganizationMemberRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('organization_members')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as OrganizationMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_members'] });
    },
  });
}

export function useDeleteOrganizationMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_members'] });
    },
  });
}

export function useBulkAddOrganizationMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddOrganizationMemberRequest[]) => {
      const validated: AddOrganizationMemberRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddOrganizationMemberRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('organization_members')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as OrganizationMember[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_members'] });
    },
  });
}

export function useBulkUpdateOrganizationMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateOrganizationMemberRequest[]) => {
      const results: OrganizationMember[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateOrganizationMemberRequestSchema.safeParse(
          items[i]
        );
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('organization_members')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as OrganizationMember);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_members'] });
    },
  });
}

export function useBulkDeleteOrganizationMembers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization_members'] });
    },
  });
}

export function useGetPayment(id: string) {
  return useQuery<Payment, Error>({
    queryKey: ['payments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Payment;
    },
    enabled: !!id,
  });
}

export function useGetAllPayments(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Payment>, Error>({
    queryKey: options?.queryKey ?? ['payments', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('payments')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Payment[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddPaymentRequest) => {
      const result = AddPaymentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('payments')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdatePaymentRequest) => {
      const result = UpdatePaymentRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('payments')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('payments').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useBulkAddPayments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddPaymentRequest[]) => {
      const validated: AddPaymentRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddPaymentRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('payments')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Payment[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useBulkUpdatePayments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdatePaymentRequest[]) => {
      const results: Payment[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdatePaymentRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('payments')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Payment);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useBulkDeletePayments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('payments').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}

export function useGetPaymentsMeta(id: string) {
  return useQuery<PaymentsMeta, Error>({
    queryKey: ['payments_meta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments_meta')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as PaymentsMeta;
    },
    enabled: !!id,
  });
}

export function useGetAllPaymentsMetas(options?: QueryOptions) {
  return useQuery<PaginatedResponse<PaymentsMeta>, Error>({
    queryKey: options?.queryKey ?? ['payments_meta', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('payments_meta')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as PaymentsMeta[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddPaymentsMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddPaymentsMetaRequest) => {
      const result = AddPaymentsMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('payments_meta')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as PaymentsMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments_meta'] });
    },
  });
}

export function useUpdatePaymentsMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdatePaymentsMetaRequest) => {
      const result = UpdatePaymentsMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('payments_meta')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as PaymentsMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments_meta'] });
    },
  });
}

export function useDeletePaymentsMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payments_meta')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments_meta'] });
    },
  });
}

export function useBulkAddPaymentsMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddPaymentsMetaRequest[]) => {
      const validated: AddPaymentsMetaRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddPaymentsMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('payments_meta')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as PaymentsMeta[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments_meta'] });
    },
  });
}

export function useBulkUpdatePaymentsMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdatePaymentsMetaRequest[]) => {
      const results: PaymentsMeta[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdatePaymentsMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('payments_meta')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as PaymentsMeta);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments_meta'] });
    },
  });
}

export function useBulkDeletePaymentsMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('payments_meta')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments_meta'] });
    },
  });
}

export function useGetProfileMeta(id: string) {
  return useQuery<ProfileMeta, Error>({
    queryKey: ['profile_meta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_meta')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as ProfileMeta;
    },
    enabled: !!id,
  });
}

export function useGetAllProfileMetas(options?: QueryOptions) {
  return useQuery<PaginatedResponse<ProfileMeta>, Error>({
    queryKey: options?.queryKey ?? ['profile_meta', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('profile_meta')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as ProfileMeta[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddProfileMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddProfileMetaRequest) => {
      const result = AddProfileMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('profile_meta')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as ProfileMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_meta'] });
    },
  });
}

export function useUpdateProfileMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateProfileMetaRequest) => {
      const result = UpdateProfileMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('profile_meta')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ProfileMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_meta'] });
    },
  });
}

export function useDeleteProfileMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profile_meta')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_meta'] });
    },
  });
}

export function useBulkAddProfileMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddProfileMetaRequest[]) => {
      const validated: AddProfileMetaRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddProfileMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('profile_meta')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as ProfileMeta[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_meta'] });
    },
  });
}

export function useBulkUpdateProfileMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateProfileMetaRequest[]) => {
      const results: ProfileMeta[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateProfileMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('profile_meta')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as ProfileMeta);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_meta'] });
    },
  });
}

export function useBulkDeleteProfileMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('profile_meta')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_meta'] });
    },
  });
}

export function useGetProfile(id: string) {
  return useQuery<Profile, Error>({
    queryKey: ['profiles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Profile;
    },
    enabled: !!id,
  });
}

export function useGetAllProfiles(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Profile>, Error>({
    queryKey: options?.queryKey ?? ['profiles', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('profiles')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Profile[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddProfileRequest) => {
      const result = AddProfileRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('profiles')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateProfileRequest) => {
      const result = UpdateProfileRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('profiles')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useBulkAddProfiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddProfileRequest[]) => {
      const validated: AddProfileRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddProfileRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('profiles')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Profile[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useBulkUpdateProfiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateProfileRequest[]) => {
      const results: Profile[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateProfileRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('profiles')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Profile);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useBulkDeleteProfiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('profiles').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useGetReview(id: string) {
  return useQuery<Review, Error>({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Review;
    },
    enabled: !!id,
  });
}

export function useGetAllReviews(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Review>, Error>({
    queryKey: options?.queryKey ?? ['reviews', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('reviews')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Review[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddReviewRequest) => {
      const result = AddReviewRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('reviews')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateReviewRequest) => {
      const result = UpdateReviewRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('reviews')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useBulkAddReviews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddReviewRequest[]) => {
      const validated: AddReviewRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddReviewRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('reviews')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Review[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useBulkUpdateReviews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateReviewRequest[]) => {
      const results: Review[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateReviewRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('reviews')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Review);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useBulkDeleteReviews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('reviews').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useGetReviewsMeta(id: string) {
  return useQuery<ReviewsMeta, Error>({
    queryKey: ['reviews_meta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews_meta')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as ReviewsMeta;
    },
    enabled: !!id,
  });
}

export function useGetAllReviewsMetas(options?: QueryOptions) {
  return useQuery<PaginatedResponse<ReviewsMeta>, Error>({
    queryKey: options?.queryKey ?? ['reviews_meta', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('reviews_meta')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as ReviewsMeta[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddReviewsMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddReviewsMetaRequest) => {
      const result = AddReviewsMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('reviews_meta')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as ReviewsMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews_meta'] });
    },
  });
}

export function useUpdateReviewsMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateReviewsMetaRequest) => {
      const result = UpdateReviewsMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('reviews_meta')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ReviewsMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews_meta'] });
    },
  });
}

export function useDeleteReviewsMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews_meta')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews_meta'] });
    },
  });
}

export function useBulkAddReviewsMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddReviewsMetaRequest[]) => {
      const validated: AddReviewsMetaRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddReviewsMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('reviews_meta')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as ReviewsMeta[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews_meta'] });
    },
  });
}

export function useBulkUpdateReviewsMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateReviewsMetaRequest[]) => {
      const results: ReviewsMeta[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateReviewsMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('reviews_meta')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as ReviewsMeta);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews_meta'] });
    },
  });
}

export function useBulkDeleteReviewsMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('reviews_meta')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews_meta'] });
    },
  });
}

export function useGetServiceMeta(id: string) {
  return useQuery<ServiceMeta, Error>({
    queryKey: ['service_meta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_meta')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as ServiceMeta;
    },
    enabled: !!id,
  });
}

export function useGetAllServiceMetas(options?: QueryOptions) {
  return useQuery<PaginatedResponse<ServiceMeta>, Error>({
    queryKey: options?.queryKey ?? ['service_meta', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('service_meta')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as ServiceMeta[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddServiceMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddServiceMetaRequest) => {
      const result = AddServiceMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('service_meta')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as ServiceMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_meta'] });
    },
  });
}

export function useUpdateServiceMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateServiceMetaRequest) => {
      const result = UpdateServiceMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('service_meta')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ServiceMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_meta'] });
    },
  });
}

export function useDeleteServiceMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_meta')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_meta'] });
    },
  });
}

export function useBulkAddServiceMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddServiceMetaRequest[]) => {
      const validated: AddServiceMetaRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddServiceMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('service_meta')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as ServiceMeta[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_meta'] });
    },
  });
}

export function useBulkUpdateServiceMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateServiceMetaRequest[]) => {
      const results: ServiceMeta[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateServiceMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('service_meta')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as ServiceMeta);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_meta'] });
    },
  });
}

export function useBulkDeleteServiceMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('service_meta')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_meta'] });
    },
  });
}

export function useGetService(id: string) {
  return useQuery<Service, Error>({
    queryKey: ['services', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Service;
    },
    enabled: !!id,
  });
}

export function useGetAllServices(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Service>, Error>({
    queryKey: options?.queryKey ?? ['services', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('services')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Service[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddServiceRequest) => {
      const result = AddServiceRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('services')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateServiceRequest) => {
      const result = UpdateServiceRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('services')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useBulkAddServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddServiceRequest[]) => {
      const validated: AddServiceRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddServiceRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('services')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Service[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useBulkUpdateServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateServiceRequest[]) => {
      const results: Service[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateServiceRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('services')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Service);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useBulkDeleteServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('services').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useGetWaitlist(id: string) {
  return useQuery<Waitlist, Error>({
    queryKey: ['waitlist', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as Waitlist;
    },
    enabled: !!id,
  });
}

export function useGetAllWaitlists(options?: QueryOptions) {
  return useQuery<PaginatedResponse<Waitlist>, Error>({
    queryKey: options?.queryKey ?? ['waitlist', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('waitlist')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as Waitlist[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddWaitlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddWaitlistRequest) => {
      const result = AddWaitlistRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('waitlist')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as Waitlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
}

export function useUpdateWaitlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateWaitlistRequest) => {
      const result = UpdateWaitlistRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('waitlist')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Waitlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
}

export function useDeleteWaitlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('waitlist').delete().eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
}

export function useBulkAddWaitlists() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddWaitlistRequest[]) => {
      const validated: AddWaitlistRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddWaitlistRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('waitlist')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as Waitlist[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
}

export function useBulkUpdateWaitlists() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateWaitlistRequest[]) => {
      const results: Waitlist[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateWaitlistRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('waitlist')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as Waitlist);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
}

export function useBulkDeleteWaitlists() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('waitlist').delete().in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
  });
}

export function useGetWaitlistMeta(id: string) {
  return useQuery<WaitlistMeta, Error>({
    queryKey: ['waitlist_meta', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_meta')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as WaitlistMeta;
    },
    enabled: !!id,
  });
}

export function useGetAllWaitlistMetas(options?: QueryOptions) {
  return useQuery<PaginatedResponse<WaitlistMeta>, Error>({
    queryKey: options?.queryKey ?? ['waitlist_meta', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('waitlist_meta')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as WaitlistMeta[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddWaitlistMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddWaitlistMetaRequest) => {
      const result = AddWaitlistMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('waitlist_meta')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as WaitlistMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist_meta'] });
    },
  });
}

export function useUpdateWaitlistMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateWaitlistMetaRequest) => {
      const result = UpdateWaitlistMetaRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('waitlist_meta')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as WaitlistMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist_meta'] });
    },
  });
}

export function useDeleteWaitlistMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('waitlist_meta')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist_meta'] });
    },
  });
}

export function useBulkAddWaitlistMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddWaitlistMetaRequest[]) => {
      const validated: AddWaitlistMetaRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddWaitlistMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('waitlist_meta')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as WaitlistMeta[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist_meta'] });
    },
  });
}

export function useBulkUpdateWaitlistMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateWaitlistMetaRequest[]) => {
      const results: WaitlistMeta[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateWaitlistMetaRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('waitlist_meta')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as WaitlistMeta);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist_meta'] });
    },
  });
}

export function useBulkDeleteWaitlistMetas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('waitlist_meta')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist_meta'] });
    },
  });
}

export function useGetWhatsappMessage(id: string) {
  return useQuery<WhatsappMessage, Error>({
    queryKey: ['whatsapp_messages', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) throw new Error('No data found');
      return data as WhatsappMessage;
    },
    enabled: !!id,
  });
}

export function useGetAllWhatsappMessages(options?: QueryOptions) {
  return useQuery<PaginatedResponse<WhatsappMessage>, Error>({
    queryKey: options?.queryKey ?? ['whatsapp_messages', options],
    queryFn: async () => {
      const { filters, sort, pagination, select: selectFields } = options || {};
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Single query with count and data
      let query = supabase
        .from('whatsapp_messages')
        .select(selectFields || '*', { count: 'exact' });
      query = applyFilters(query, filters);

      if (sort) {
        query = query.order(sort.column, {
          ascending: sort.direction === 'asc',
        });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const total = count || 0;

      return {
        data: data as unknown as WhatsappMessage[],
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAddWhatsappMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddWhatsappMessageRequest) => {
      const result = AddWhatsappMessageRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert(result.data as never)
        .select()
        .single();
      if (error) throw error;
      return data as WhatsappMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_messages'] });
    },
  });
}

export function useUpdateWhatsappMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateWhatsappMessageRequest) => {
      const result = UpdateWhatsappMessageRequestSchema.safeParse(item);
      if (!result.success) {
        throw new Error(
          `Validation failed: ${result.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { id, ...updates } = result.data;
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .update(updates as never)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as WhatsappMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_messages'] });
    },
  });
}

export function useDeleteWhatsappMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('whatsapp_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_messages'] });
    },
  });
}

export function useBulkAddWhatsappMessages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: AddWhatsappMessageRequest[]) => {
      const validated: AddWhatsappMessageRequest[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = AddWhatsappMessageRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        validated.push(result.data);
      }
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .insert(validated as never)
        .select();
      if (error) throw error;
      return data as WhatsappMessage[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_messages'] });
    },
  });
}

export function useBulkUpdateWhatsappMessages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: UpdateWhatsappMessageRequest[]) => {
      const results: WhatsappMessage[] = [];
      for (let i = 0; i < items.length; i++) {
        const result = UpdateWhatsappMessageRequestSchema.safeParse(items[i]);
        if (!result.success) {
          throw new Error(
            `Validation failed at index ${i}: ${result.error.issues
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ')}`
          );
        }
        const { id, ...updates } = result.data;
        const { data, error } = await supabase
          .from('whatsapp_messages')
          .update(updates as never)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        results.push(data as WhatsappMessage);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_messages'] });
    },
  });
}

export function useBulkDeleteWhatsappMessages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('whatsapp_messages')
        .delete()
        .in('id', ids);
      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp_messages'] });
    },
  });
}

interface AddCustomerToCompanyMutationOptions
  extends Omit<
    UseMutationOptions<
      AddCustomerToCompanyReturns,
      Error,
      AddCustomerToCompanyArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useAddCustomerToCompany(
  options?: AddCustomerToCompanyMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: AddCustomerToCompanyArgs) => {
      const argsResult = AddCustomerToCompanyArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'add_customer_to_company',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = AddCustomerToCompanyReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

type AutoExpireInvitesQueryOptions = Omit<
  UseQueryOptions<AutoExpireInvitesReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useAutoExpireInvites(
  args: AutoExpireInvitesArgs,
  options?: AutoExpireInvitesQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['auto_expire_invites', args],
    queryFn: async () => {
      const argsResult = AutoExpireInvitesArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'auto_expire_invites',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = AutoExpireInvitesReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

interface CreateAuditLogMutationOptions
  extends Omit<
    UseMutationOptions<
      CreateAuditLogReturns,
      Error,
      CreateAuditLogArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useCreateAuditLog(options?: CreateAuditLogMutationOptions) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: CreateAuditLogArgs) => {
      const argsResult = CreateAuditLogArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'create_audit_log',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = CreateAuditLogReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

interface CreateCustomerProfileMutationOptions
  extends Omit<
    UseMutationOptions<
      CreateCustomerProfileReturns,
      Error,
      CreateCustomerProfileArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useCreateCustomerProfile(
  options?: CreateCustomerProfileMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: CreateCustomerProfileArgs) => {
      const argsResult = CreateCustomerProfileArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'create_customer_profile',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = CreateCustomerProfileReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

interface CreateNotificationMutationOptions
  extends Omit<
    UseMutationOptions<
      CreateNotificationReturns,
      Error,
      CreateNotificationArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useCreateNotification(
  options?: CreateNotificationMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: CreateNotificationArgs) => {
      const argsResult = CreateNotificationArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'create_notification',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = CreateNotificationReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

interface CreateOrganizationInviteMutationOptions
  extends Omit<
    UseMutationOptions<
      CreateOrganizationInviteReturns,
      Error,
      CreateOrganizationInviteArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useCreateOrganizationInvite(
  options?: CreateOrganizationInviteMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: CreateOrganizationInviteArgs) => {
      const argsResult = CreateOrganizationInviteArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'create_organization_invite',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult =
        CreateOrganizationInviteReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

interface CreateWhatsappMessageMutationOptions
  extends Omit<
    UseMutationOptions<
      CreateWhatsappMessageReturns,
      Error,
      CreateWhatsappMessageArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useCreateWhatsappMessage(
  options?: CreateWhatsappMessageMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: CreateWhatsappMessageArgs) => {
      const argsResult = CreateWhatsappMessageArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'create_whatsapp_message',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = CreateWhatsappMessageReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

type GenerateInviteCodeQueryOptions = Omit<
  UseQueryOptions<GenerateInviteCodeReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGenerateInviteCode(
  args: GenerateInviteCodeArgs,
  options?: GenerateInviteCodeQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['generate_invite_code', args],
    queryFn: async () => {
      const argsResult = GenerateInviteCodeArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'generate_invite_code',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GenerateInviteCodeReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetAccessibleCompaniesQueryOptions = Omit<
  UseQueryOptions<GetAccessibleCompaniesReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetAccessibleCompanies(
  args: GetAccessibleCompaniesArgs,
  options?: GetAccessibleCompaniesQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_accessible_companies', args],
    queryFn: async () => {
      const argsResult = GetAccessibleCompaniesArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_accessible_companies',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetAccessibleCompaniesReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetCompanyCustomersQueryOptions = Omit<
  UseQueryOptions<GetCompanyCustomersReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetCompanyCustomers(
  args: GetCompanyCustomersArgs,
  options?: GetCompanyCustomersQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_company_customers', args],
    queryFn: async () => {
      const argsResult = GetCompanyCustomersArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_company_customers',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetCompanyCustomersReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetCustomerCompaniesQueryOptions = Omit<
  UseQueryOptions<GetCustomerCompaniesReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetCustomerCompanies(
  args: GetCustomerCompaniesArgs,
  options?: GetCustomerCompaniesQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_customer_companies', args],
    queryFn: async () => {
      const argsResult = GetCustomerCompaniesArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_customer_companies',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetCustomerCompaniesReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetEmployeeCompanyScheduleQueryOptions = Omit<
  UseQueryOptions<GetEmployeeCompanyScheduleReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetEmployeeCompanySchedule(
  args: GetEmployeeCompanyScheduleArgs,
  options?: GetEmployeeCompanyScheduleQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_employee_company_schedule', args],
    queryFn: async () => {
      const argsResult = GetEmployeeCompanyScheduleArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_employee_company_schedule',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult =
        GetEmployeeCompanyScheduleReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetEmployeeShiftQueryOptions = Omit<
  UseQueryOptions<GetEmployeeShiftReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetEmployeeShift(
  args: GetEmployeeShiftArgs,
  options?: GetEmployeeShiftQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_employee_shift', args],
    queryFn: async () => {
      const argsResult = GetEmployeeShiftArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_employee_shift',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetEmployeeShiftReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetMyCompanyIdsQueryOptions = Omit<
  UseQueryOptions<GetMyCompanyIdsReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetMyCompanyIds(
  args: GetMyCompanyIdsArgs,
  options?: GetMyCompanyIdsQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_my_company_ids', args],
    queryFn: async () => {
      const argsResult = GetMyCompanyIdsArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_my_company_ids',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetMyCompanyIdsReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetOrganizationInvitesQueryOptions = Omit<
  UseQueryOptions<GetOrganizationInvitesReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetOrganizationInvites(
  args: GetOrganizationInvitesArgs,
  options?: GetOrganizationInvitesQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_organization_invites', args],
    queryFn: async () => {
      const argsResult = GetOrganizationInvitesArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_organization_invites',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetOrganizationInvitesReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetShiftScheduleForDayQueryOptions = Omit<
  UseQueryOptions<GetShiftScheduleForDayReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetShiftScheduleForDay(
  args: GetShiftScheduleForDayArgs,
  options?: GetShiftScheduleForDayQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_shift_schedule_for_day', args],
    queryFn: async () => {
      const argsResult = GetShiftScheduleForDayArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_shift_schedule_for_day',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetShiftScheduleForDayReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetStaffWithServicesQueryOptions = Omit<
  UseQueryOptions<GetStaffWithServicesReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetStaffWithServices(
  args: GetStaffWithServicesArgs,
  options?: GetStaffWithServicesQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_staff_with_services', args],
    queryFn: async () => {
      const argsResult = GetStaffWithServicesArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_staff_with_services',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetStaffWithServicesReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetUserCompaniesQueryOptions = Omit<
  UseQueryOptions<GetUserCompaniesReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetUserCompanies(
  args: GetUserCompaniesArgs,
  options?: GetUserCompaniesQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_user_companies', args],
    queryFn: async () => {
      const argsResult = GetUserCompaniesArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_user_companies',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetUserCompaniesReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetWaitlistByEmployeeQueryOptions = Omit<
  UseQueryOptions<GetWaitlistByEmployeeReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetWaitlistByEmployee(
  args: GetWaitlistByEmployeeArgs,
  options?: GetWaitlistByEmployeeQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_waitlist_by_employee', args],
    queryFn: async () => {
      const argsResult = GetWaitlistByEmployeeArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_waitlist_by_employee',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetWaitlistByEmployeeReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type GetWaitlistByPriorityQueryOptions = Omit<
  UseQueryOptions<GetWaitlistByPriorityReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useGetWaitlistByPriority(
  args: GetWaitlistByPriorityArgs,
  options?: GetWaitlistByPriorityQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['get_waitlist_by_priority', args],
    queryFn: async () => {
      const argsResult = GetWaitlistByPriorityArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'get_waitlist_by_priority',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = GetWaitlistByPriorityReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type HandleWhatsappResponseQueryOptions = Omit<
  UseQueryOptions<HandleWhatsappResponseReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useHandleWhatsappResponse(
  args: HandleWhatsappResponseArgs,
  options?: HandleWhatsappResponseQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['handle_whatsapp_response', args],
    queryFn: async () => {
      const argsResult = HandleWhatsappResponseArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'handle_whatsapp_response',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = HandleWhatsappResponseReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type IsEmployeeQueryOptions = Omit<
  UseQueryOptions<IsEmployeeReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useIsEmployee(
  args: IsEmployeeArgs,
  options?: IsEmployeeQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['is_employee', args],
    queryFn: async () => {
      const argsResult = IsEmployeeArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'is_employee',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = IsEmployeeReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

type LoginCheckQueryOptions = Omit<
  UseQueryOptions<LoginCheckReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useLoginCheck(
  args: LoginCheckArgs,
  options?: LoginCheckQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['login_check', args],
    queryFn: async () => {
      const argsResult = LoginCheckArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'login_check',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = LoginCheckReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

interface MutationAcceptOrganizationInviteMutationOptions
  extends Omit<
    UseMutationOptions<
      MutationAcceptOrganizationInviteReturns,
      Error,
      MutationAcceptOrganizationInviteArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useMutationAcceptOrganizationInvite(
  options?: MutationAcceptOrganizationInviteMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: MutationAcceptOrganizationInviteArgs) => {
      const argsResult =
        MutationAcceptOrganizationInviteArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'mutation_accept_organization_invite',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult =
        MutationAcceptOrganizationInviteReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

interface MutationCancelOrganizationInviteMutationOptions
  extends Omit<
    UseMutationOptions<
      MutationCancelOrganizationInviteReturns,
      Error,
      MutationCancelOrganizationInviteArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useMutationCancelOrganizationInvite(
  options?: MutationCancelOrganizationInviteMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: MutationCancelOrganizationInviteArgs) => {
      const argsResult =
        MutationCancelOrganizationInviteArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'mutation_cancel_organization_invite',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult =
        MutationCancelOrganizationInviteReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

interface MutationRejectOrganizationInviteMutationOptions
  extends Omit<
    UseMutationOptions<
      MutationRejectOrganizationInviteReturns,
      Error,
      MutationRejectOrganizationInviteArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useMutationRejectOrganizationInvite(
  options?: MutationRejectOrganizationInviteMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: MutationRejectOrganizationInviteArgs) => {
      const argsResult =
        MutationRejectOrganizationInviteArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'mutation_reject_organization_invite',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult =
        MutationRejectOrganizationInviteReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

type SetWhatsappMessageExternalIdQueryOptions = Omit<
  UseQueryOptions<SetWhatsappMessageExternalIdReturns, Error>,
  'queryKey' | 'queryFn'
> & { queryKey?: unknown[] };

export function useSetWhatsappMessageExternalId(
  args: SetWhatsappMessageExternalIdArgs,
  options?: SetWhatsappMessageExternalIdQueryOptions
) {
  const { queryKey, ...queryOptions } = options ?? {};
  return useQuery({
    queryKey: queryKey ?? ['set_whatsapp_message_external_id', args],
    queryFn: async () => {
      const argsResult = SetWhatsappMessageExternalIdArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'set_whatsapp_message_external_id',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult =
        SetWhatsappMessageExternalIdReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...queryOptions,
  });
}

interface UpdateProfileCompanyMutationOptions
  extends Omit<
    UseMutationOptions<
      UpdateProfileCompanyReturns,
      Error,
      UpdateProfileCompanyArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useUpdateProfileCompany(
  options?: UpdateProfileCompanyMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: UpdateProfileCompanyArgs) => {
      const argsResult = UpdateProfileCompanyArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'update_profile_company',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult = UpdateProfileCompanyReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}

interface UpdateWhatsappMessageStatusMutationOptions
  extends Omit<
    UseMutationOptions<
      UpdateWhatsappMessageStatusReturns,
      Error,
      UpdateWhatsappMessageStatusArgs,
      unknown
    >,
    'mutationFn'
  > {
  queryInvalidate?: string[][];
}

export function useUpdateWhatsappMessageStatus(
  options?: UpdateWhatsappMessageStatusMutationOptions
) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: UpdateWhatsappMessageStatusArgs) => {
      const argsResult = UpdateWhatsappMessageStatusArgsSchema.safeParse(args);
      if (!argsResult.success) {
        throw new Error(
          `Validation failed: ${argsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      const { data, error } = await supabase.rpc(
        'update_whatsapp_message_status',
        argsResult.data as never
      );
      if (error) throw error;
      const returnsResult =
        UpdateWhatsappMessageStatusReturnsSchema.safeParse(data);
      if (!returnsResult.success) {
        throw new Error(
          `Response validation failed: ${returnsResult.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(', ')}`
        );
      }
      return returnsResult.data;
    },
    ...mutationOptions,
    onSuccess: (...args) => {
      if (queryInvalidate) {
        queryInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      onSuccess?.(...args);
    },
  });
}
