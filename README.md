# Supabase TanStack Zod Codegen

A CLI tool to automatically generate TanStack Query (React Query v5) hooks, Zod schemas, and TypeScript types for your Supabase Database.

## Features

- Generates TanStack Query v5 hooks for CRUD operations
- Generates Zod v4 schemas for runtime validation
- TypeScript types derived from Zod schemas using `z.infer`
- Automatic cache invalidation on mutations
- **Filter, Pagination & Select** support for `useGetAll` hooks
- **Mutations return data** - `useAdd` and `useUpdate` return the created/updated record
- **Bulk operations** - `useBulkAdd`, `useBulkUpdate`, `useBulkDelete` hooks
- **Database Functions (RPC)** support with auto-generated hooks
- **Database Enums** support with Zod schemas
- **Optimized queries** - Single query for count + data (no extra requests)
- **Query Invalidation** - Mutation hooks support `queryInvalidate` option for automatic cache invalidation
- Works with both `interface Database` and `type Database` (new Supabase format)

## Installation

```bash
npm install -g supabase-tanstack-zod-codegen
```

Or with yarn:

```bash
yarn global add supabase-tanstack-zod-codegen
```

## Requirements

Your project needs these peer dependencies:

```bash
npm install @supabase/supabase-js @tanstack/react-query zod
```

## Usage

### 1. Generate Supabase types

```bash
supabase gen types typescript --project-id "<your-project-id>" --schema public > src/database.types.ts
```

### 2. Create config file

Create `codegen.config.json`. There are multiple output modes available:

#### Option A: Single File (Legacy)

All generated code in one file:

```json
{
  "outputPath": "src/generated.ts",
  "typesPath": "src/database.types.ts",
  "relativeSupabasePath": "./supabase",
  "supabaseExportName": "supabase"
}
```

#### Option B: Separate Files (Hooks & Schemas)

Split hooks and schemas into separate files:

```json
{
  "typesPath": "src/database.types.ts",
  "relativeSupabasePath": "./supabase",
  "supabaseExportName": "supabase",
  "output": {
    "hooks": "src/generated/hooks.ts",
    "schemas": "src/generated/schemas.ts"
  }
}
```

#### Option C: Per-Table/Function Files

Each table and function gets its own directory with hooks and schemas:

```json
{
  "typesPath": "src/database.types.ts",
  "relativeSupabasePath": "./supabase",
  "supabaseExportName": "supabase",
  "output": {
    "tablesDir": {
      "hooks": "src/generated/tables/{{table}}/hooks.ts",
      "schemas": "src/generated/tables/{{table}}/schemas.ts"
    },
    "functionsDir": {
      "hooks": "src/generated/functions/{{function}}/hooks.ts",
      "schemas": "src/generated/functions/{{function}}/schemas.ts"
    },
    "enums": {
      "schemas": "src/generated/enums/schemas.ts"
    }
  }
}
```

This generates a structure like:
```
src/generated/
├── enums/
│   └── schemas.ts
├── tables/
│   ├── todo_items/
│   │   ├── hooks.ts
│   │   └── schemas.ts
│   └── profiles/
│       ├── hooks.ts
│       └── schemas.ts
└── functions/
    ├── get_user_profile/
    │   ├── hooks.ts
    │   └── schemas.ts
    └── create_todo/
        ├── hooks.ts
        └── schemas.ts
```

#### Option D: Mixed (Tables Separate, Functions Combined)

Split tables into separate files but keep all functions in one file:

```json
{
  "typesPath": "src/database.types.ts",
  "relativeSupabasePath": "./supabase",
  "supabaseExportName": "supabase",
  "output": {
    "tablesDir": {
      "hooks": "src/generated/tables/{{table}}/hooks.ts",
      "schemas": "src/generated/tables/{{table}}/schemas.ts"
    },
    "functions": {
      "hooks": "src/generated/functions/hooks.ts",
      "schemas": "src/generated/functions/schemas.ts"
    },
    "enums": {
      "schemas": "src/generated/enums/schemas.ts"
    }
  }
}
```

**Template Placeholders:**
- `{{table}}` - Replaced with the table name (e.g., `todo_items`, `profiles`)
- `{{function}}` - Replaced with the function name (e.g., `get_user_profile`, `create_todo`)

> **📁 Example config files** are available in the [example/](example/) directory:
> - [codegen.config.json](example/codegen.config.json) - Single file output
> - [codegen.separate.config.json](example/codegen.separate.config.json) - Separate hooks & schemas
> - [codegen.per-table.config.json](example/codegen.per-table.config.json) - Per-table/function files
> - [codegen.mixed.config.json](example/codegen.mixed.config.json) - Tables separate, functions combined

### 3. Run the generator

```bash
npx supabase-tanstack-zod-codegen generate codegen.config.json
```

## Generated Output

### Tables

For a table called `todo_items`, the following will be generated:

#### Zod Schemas

```typescript
export const TodoItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
});

export const AddTodoItemRequestSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.string().optional(),
  created_at: z.string().optional(),
});

export const UpdateTodoItemRequestSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    created_at: z.string().optional(),
  })
  .extend({ id: z.string() });
```

#### Types (derived from Zod)

```typescript
export type TodoItem = z.infer<typeof TodoItemSchema>;
export type AddTodoItemRequest = z.infer<typeof AddTodoItemRequestSchema>;
export type UpdateTodoItemRequest = z.infer<typeof UpdateTodoItemRequestSchema>;
```

#### Hooks

```typescript
// Fetch single item by ID
useGetTodoItem(id: string)

// Fetch all items with filter, sort, pagination and select
useGetAllTodoItems(options?: QueryOptions)

// Add new item (returns created record)
useAddTodoItem()

// Update item (returns updated record)
useUpdateTodoItem()

// Delete item by ID
useDeleteTodoItem()

// Bulk operations
useBulkAddTodoItems()    // Insert multiple records
useBulkUpdateTodoItems() // Update multiple records
useBulkDeleteTodoItems() // Delete multiple records
```

### Database Functions (RPC)

Database functions automatically generate either `useQuery` or `useMutation` hooks based on the function name:

| Prefix | Hook Type | Example |
|--------|-----------|---------|
| `get_*` | `useQuery` | `get_user_todos` → `useGetUserTodos(args)` |
| `search_*` | `useQuery` | `search_todos` → `useSearchTodos(args)` |
| `add_*` | `useMutation` | `add_todo` → `useAddTodo()` |
| `create_*` | `useMutation` | `create_todo` → `useCreateTodo()` |
| `update_*` | `useMutation` | `update_todo` → `useUpdateTodo()` |
| `delete_*` | `useMutation` | `delete_todo` → `useDeleteTodo()` |
| `bulk_add_*` | `useMutation` | `bulk_add_todos` → `useBulkAddTodos()` |
| `bulk_update_*` | `useMutation` | `bulk_update_todos` → `useBulkUpdateTodos()` |
| `bulk_delete_*` | `useMutation` | `bulk_delete_todos` → `useBulkDeleteTodos()` |
| `mutation_*` | `useMutation` | `mutation_reset_data` → `useMutationResetData()` |
| Other | `useQuery` | `calculate_total` → `useCalculateTotal(args)` |

> **Note:** All function return schemas include `.nullable()` since Supabase RPC calls can return `null`. This applies to both the outer schema and all fields within the return object/array.

#### Query Function Example

For a Supabase function like:

```sql
CREATE FUNCTION get_user_todos(user_id uuid)
RETURNS TABLE (id uuid, name text, description text, created_at timestamp)
```

The following will be generated:

```typescript
// Zod Schemas
export const GetUserTodosArgsSchema = z.object({
  user_id: z.string(),
});

export const GetUserTodosReturnsSchema = z.array(
  z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    created_at: z.string().nullable(),
  })
).nullable();

// Types
export type GetUserTodosArgs = z.infer<typeof GetUserTodosArgsSchema>;
export type GetUserTodosReturns = z.infer<typeof GetUserTodosReturnsSchema>;

// Hook (useQuery for get_* functions)
export function useGetUserTodos(args: GetUserTodosArgs) {
  return useQuery({
    queryKey: ['get_user_todos', args],
    queryFn: async () => {
      const validated = GetUserTodosArgsSchema.parse(args);
      const { data, error } = await supabase.rpc('get_user_todos', validated);
      if (error) throw error;
      return GetUserTodosReturnsSchema.parse(data);
    },
  });
}
```

#### Mutation Function Example

For a Supabase function like:

```sql
CREATE FUNCTION create_todo(name text, description text)
RETURNS uuid
```

The following will be generated:

```typescript
// Zod Schemas
export const CreateTodoArgsSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const CreateTodoReturnsSchema = z.object({
  id: z.string().nullable(),
}).nullable();

// Types
export type CreateTodoArgs = z.infer<typeof CreateTodoArgsSchema>;
export type CreateTodoReturns = z.infer<typeof CreateTodoReturnsSchema>;

// Hook (useMutation for create_* functions)
export function useCreateTodo(options?: CreateTodoMutationOptions) {
  const queryClient = useQueryClient();
  const { queryInvalidate, onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: async (args: CreateTodoArgs) => {
      const validated = CreateTodoArgsSchema.parse(args);
      const { data, error } = await supabase.rpc('create_todo', validated);
      if (error) throw error;
      return CreateTodoReturnsSchema.parse(data);
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
```

#### Usage

```tsx
// Query hook - pass args directly
const { data: todos } = useGetUserTodos({ user_id: 'user-123' });

// Query hook with options
const { data: todos } = useGetUserTodos(
  { user_id: 'user-123' },
  {
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  }
);

// Mutation hook - call mutate/mutateAsync with args
const createTodo = useCreateTodo();
const handleCreate = async () => {
  const newId = await createTodo.mutateAsync({
    name: 'New Todo',
    description: 'Description',
  });
};

// Mutation hook with automatic query invalidation
const createTodo = useCreateTodo({
  queryInvalidate: [
    ['get_user_todos'],           // Invalidate user todos query
    ['todo_items'],               // Invalidate todo items list
  ],
  onSuccess: (data) => {
    console.log('Todo created:', data);
  },
});
```

### Database Enums

For Supabase enums like:

```sql
CREATE TYPE todo_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
```

The following will be generated:

```typescript
export const TodoStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled']);
export type TodoStatus = z.infer<typeof TodoStatusSchema>;
```

## Filter & Pagination

All `useGetAll` hooks support filtering, sorting, and pagination:

### Basic Usage

```tsx
// Simple usage - returns paginated data (default: page 1, pageSize 10)
const { data } = useGetAllTodoItems();

// Access data and pagination info
console.log(data?.data);       // TodoItem[]
console.log(data?.pagination); // { page, pageSize, total, totalPages }
```

### Enabled

```tsx
// Conditionally enable/disable the query
const { data } = useGetAllTodoItems({
  enabled: !!userId,  // Only fetch when userId exists
  filters: [{ column: 'user_id', operator: 'eq', value: userId }],
});

// Disable query entirely
const { data } = useGetAllTodoItems({
  enabled: false,
});
```

### Pagination

```tsx
const { data } = useGetAllTodoItems({
  pagination: { page: 2, pageSize: 20 }
});
```

### Filtering

```tsx
const { data } = useGetAllTodoItems({
  filters: [
    { column: 'name', operator: 'ilike', value: '%test%' },
    { column: 'created_at', operator: 'gte', value: '2024-01-01' }
  ]
});
```

#### Available Filter Operators

| Operator | Description |
|----------|-------------|
| `eq` | Equal |
| `neq` | Not equal |
| `gt` | Greater than |
| `gte` | Greater than or equal |
| `lt` | Less than |
| `lte` | Less than or equal |
| `like` | Pattern matching (case sensitive) |
| `ilike` | Pattern matching (case insensitive) |
| `is` | IS check (for null) |
| `in` | Value in array |

### Sorting

```tsx
const { data } = useGetAllTodoItems({
  sort: { column: 'created_at', direction: 'desc' }
});
```

### Select Specific Fields

```tsx
// Only fetch specific columns (reduces bandwidth)
const { data } = useGetAllTodoItems({
  select: 'id,name,created_at'
});
```

### Combined Example

```tsx
const { data, isLoading } = useGetAllTodoItems({
  filters: [
    { column: 'status', operator: 'eq', value: 'pending' }
  ],
  sort: { column: 'created_at', direction: 'desc' },
  pagination: { page: 1, pageSize: 25 }
});

// Response structure:
// {
//   data: TodoItem[],
//   pagination: {
//     page: 1,
//     pageSize: 25,
//     total: 100,
//     totalPages: 4
//   }
// }
```

### Pagination Component Example

```tsx
function TodoListWithPagination() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllTodoItems({
    pagination: { page, pageSize: 10 }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <ul>
        {data?.data.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>

      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span>Page {data?.pagination.page} of {data?.pagination.totalPages}</span>
        <button
          disabled={page >= (data?.pagination.totalPages || 1)}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## Mutations Return Data

`useAdd` and `useUpdate` hooks return the created/updated record:

```tsx
const addTodo = useAddTodoItem();
const updateTodo = useUpdateTodoItem();

// Add returns the created record
const handleAdd = async () => {
  const newTodo = await addTodo.mutateAsync({
    name: 'New Todo',
    description: 'Description here',
  });
  console.log('Created:', newTodo.id); // Access the new record immediately
};

// Update returns the updated record
const handleUpdate = async () => {
  const updated = await updateTodo.mutateAsync({
    id: 'todo-123',
    name: 'Updated Name',
  });
  console.log('Updated:', updated.name);
};
```

## Bulk Operations

Perform operations on multiple records at once:

```tsx
const bulkAdd = useBulkAddTodoItems();
const bulkUpdate = useBulkUpdateTodoItems();
const bulkDelete = useBulkDeleteTodoItems();

// Add multiple records
const handleBulkAdd = async () => {
  const newTodos = await bulkAdd.mutateAsync([
    { name: 'Todo 1', description: 'First' },
    { name: 'Todo 2', description: 'Second' },
    { name: 'Todo 3', description: 'Third' },
  ]);
  console.log(`Created ${newTodos.length} todos`);
};

// Update multiple records
const handleBulkUpdate = async () => {
  const updated = await bulkUpdate.mutateAsync([
    { id: 'id-1', name: 'Updated 1' },
    { id: 'id-2', name: 'Updated 2' },
  ]);
  console.log(`Updated ${updated.length} todos`);
};

// Delete multiple records
const handleBulkDelete = async () => {
  await bulkDelete.mutateAsync(['id-1', 'id-2', 'id-3']);
  console.log('Deleted 3 todos');
};
```

## Example Usage

```tsx
import {
  useGetAllTodoItems,
  useAddTodoItem,
  useBulkAddTodoItems,
  useGetUserTodos
} from './generated';

function TodoList() {
  const { data, isLoading } = useGetAllTodoItems({
    sort: { column: 'created_at', direction: 'desc' },
    pagination: { page: 1, pageSize: 20 }
  });
  const addTodo = useAddTodoItem();
  const bulkAdd = useBulkAddTodoItems();

  // Using RPC function
  const { data: userTodos } = useGetUserTodos({ user_id: 'user-123' });

  const handleAdd = async () => {
    const newTodo = await addTodo.mutateAsync({
      name: 'New Todo',
      description: 'Description here',
    });
    console.log('Created todo with id:', newTodo.id);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <ul>
        {data?.data.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
      <p>Total: {data?.pagination.total} items</p>
      <button onClick={handleAdd}>Add Todo</button>
    </div>
  );
}
```

## Config Options

| Option | Required | Description |
|--------|----------|-------------|
| `typesPath` | Yes | Path to Supabase generated types file |
| `outputPath` | No* | Single file output path (legacy mode) |
| `output` | No* | Flexible output configuration (see below) |
| `relativeSupabasePath` | No | Relative path to your Supabase client from the output file |
| `supabaseExportName` | No | Name of your Supabase client export (default: `supabase`) |
| `prettierConfigPath` | No | Path to your Prettier config for formatting |

\* Either `outputPath` or `output` must be provided.

### Output Configuration

When using `output` instead of `outputPath`, you have these options:

| Option | Description |
|--------|-------------|
| `output.singleFile` | Single file output (alternative to `outputPath`) |
| `output.hooks` | Path for all hooks in one file |
| `output.schemas` | Path for all schemas in one file |
| `output.tablesDir.hooks` | Template path for per-table hooks (use `{{table}}`) |
| `output.tablesDir.schemas` | Template path for per-table schemas (use `{{table}}`) |
| `output.functionsDir.hooks` | Template path for per-function hooks (use `{{function}}`) |
| `output.functionsDir.schemas` | Template path for per-function schemas (use `{{function}}`) |
| `output.functions.hooks` | Path for all function hooks in one file |
| `output.functions.schemas` | Path for all function schemas in one file |
| `output.enums.schemas` | Path for enum schemas |

## Generated Types Reference

### Global Types

```typescript
// Filter operator type
type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in';

// Filter condition
interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

// Sort direction
type SortDirection = 'asc' | 'desc';

// Sort option
interface SortOption {
  column: string;
  direction?: SortDirection; // default: 'asc'
}

// Pagination options
interface Pagination {
  page?: number;    // default: 1
  pageSize?: number; // default: 10, max: 100
}

// Query options for useGetAll hooks
interface QueryOptions {
  enabled?: boolean;  // default: true
  filters?: FilterCondition[];
  sort?: SortOption;
  pagination?: Pagination;
  select?: string; // e.g., 'id,name,created_at'
}

// Paginated response wrapper
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

## License

MIT
