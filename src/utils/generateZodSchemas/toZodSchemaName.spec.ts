import { toZodSchemaName } from './toZodSchemaName';

describe('toZodSchemaName', () => {
  describe('Get operation', () => {
    it('should return singular PascalCase with Schema suffix', () => {
      expect(toZodSchemaName({ tableName: 'todo_items', operation: 'Get' })).toBe(
        'TodoItemSchema'
      );
    });

    it('should handle already singular names', () => {
      expect(toZodSchemaName({ tableName: 'profile', operation: 'Get' })).toBe(
        'ProfileSchema'
      );
    });

    it('should handle irregular plurals', () => {
      expect(toZodSchemaName({ tableName: 'people', operation: 'Get' })).toBe(
        'PersonSchema'
      );
    });
  });

  describe('Add operation', () => {
    it('should return Add prefix with RequestSchema suffix', () => {
      expect(toZodSchemaName({ tableName: 'todo_items', operation: 'Add' })).toBe(
        'AddTodoItemRequestSchema'
      );
    });
  });

  describe('Update operation', () => {
    it('should return Update prefix with RequestSchema suffix', () => {
      expect(toZodSchemaName({ tableName: 'todo_items', operation: 'Update' })).toBe(
        'UpdateTodoItemRequestSchema'
      );
    });
  });

  describe('edge cases', () => {
    it('should handle hyphenated names', () => {
      expect(toZodSchemaName({ tableName: 'user-profiles', operation: 'Get' })).toBe(
        'UserProfileSchema'
      );
    });

    it('should handle mixed separators', () => {
      expect(toZodSchemaName({ tableName: 'user_profile-items', operation: 'Get' })).toBe(
        'UserProfileItemSchema'
      );
    });
  });
});
