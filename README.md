# Supabase TanStack Zod Codegen

A CLI tool to automatically generate TanStack Query (React Query v5) hooks, Zod schemas, and TypeScript types for your Supabase Database.

## Features

- Generates TanStack Query v5 hooks for CRUD operations
- Generates Zod v4 schemas for runtime validation
- TypeScript types derived from Zod schemas using `z.infer`
- Automatic cache invalidation on mutations
- Works with Supabase generated types

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

For a table called `todo_items`, the following will be generated:

### Zod Schemas

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

### Types (derived from Zod)

```typescript
export type TodoItem = z.infer<typeof TodoItemSchema>;
export type AddTodoItemRequest = z.infer<typeof AddTodoItemRequestSchema>;
export type UpdateTodoItemRequest = z.infer<typeof UpdateTodoItemRequestSchema>;
```

### Hooks

```typescript
// Fetch single item by ID
useGetTodoItem(id: string)

// Fetch all items
useGetAllTodoItems()

// Add new item (with Zod validation)
useAddTodoItem()

// Update item (with Zod validation)
useUpdateTodoItem()

// Delete item by ID
useDeleteTodoItem()
```

## Example Usage

```tsx
import { useGetAllTodoItems, useAddTodoItem } from './generated';

function TodoList() {
  const { data: todos, isLoading } = useGetAllTodoItems();
  const addTodo = useAddTodoItem();

  const handleAdd = () => {
    addTodo.mutate({
      name: 'New Todo',
      description: 'Description here',
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
      <button onClick={handleAdd}>Add Todo</button>
    </ul>
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

## License

MIT
