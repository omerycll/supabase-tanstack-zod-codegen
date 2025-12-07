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

Create `codegen.config.json`:

```json
{
  "outputPath": "src/generated.ts",
  "typesPath": "src/database.types.ts",
  "relativeSupabasePath": "./supabase",
  "supabaseExportName": "supabase",
  "prettierConfigPath": ".prettierrc"
}
```

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
    id: z.string(),
    name: z.string(),
    description: z.string(),
    created_at: z.string(),
  })
);

// Types
export type GetUserTodosArgs = z.infer<typeof GetUserTodosArgsSchema>;
export type GetUserTodosReturns = z.infer<typeof GetUserTodosReturnsSchema>;

// Hook
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
| `outputPath` | Yes | Path where generated code will be written |
| `typesPath` | Yes | Path to Supabase generated types file |
| `relativeSupabasePath` | No | Relative path to your Supabase client from the output file |
| `supabaseExportName` | No | Name of your Supabase client export (default: `supabase`) |
| `prettierConfigPath` | No | Path to your Prettier config for formatting |

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
