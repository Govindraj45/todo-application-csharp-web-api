using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Services;

public interface ITodoService
{
    Task<List<TodoItemDto>> GetTodosAsync(string? search, TodoCategory? category, PriorityLevel? priority);
    Task<TodoItemDto> GetTodoByIdAsync(int id);
    Task<TodoItemDto> CreateTodoAsync(CreateTodoDto dto);
    Task<TodoItemDto> UpdateTodoAsync(int id, UpdateTodoDto dto);
    Task DeleteTodoAsync(int id);
}
