using TodoApi.Models;

namespace TodoApi.Repositories;

public interface ITodoRepository
{
    Task<List<TodoItem>> GetAllAsync(string? search, TodoCategory? category, PriorityLevel? priority);
    Task<TodoItem?> GetByIdAsync(int id);
    Task<TodoItem> AddAsync(TodoItem item);
    Task UpdateAsync(TodoItem item);
    Task DeleteAsync(TodoItem item);
    Task<bool> ExistsAsync(int id);
}
