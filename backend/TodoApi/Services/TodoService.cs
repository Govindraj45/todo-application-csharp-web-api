using TodoApi.DTOs;
using TodoApi.Exceptions;
using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Services;

// Business logic lives here, separate from HTTP concerns (controller) and
// persistence concerns (repository). Makes it easy to unit test without a DB.
public class TodoService : ITodoService
{
    private readonly ITodoRepository _repository;
    private readonly ILogger<TodoService> _logger;

    public TodoService(ITodoRepository repository, ILogger<TodoService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<List<TodoItemDto>> GetTodosAsync(string? search, TodoCategory? category, PriorityLevel? priority)
    {
        var items = await _repository.GetAllAsync(search, category, priority);
        return items.Select(MapToDto).ToList();
    }

    public async Task<TodoItemDto> GetTodoByIdAsync(int id)
    {
        var item = await _repository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Todo item with id {id} was not found.");

        return MapToDto(item);
    }

    public async Task<TodoItemDto> CreateTodoAsync(CreateTodoDto dto)
    {
        ValidateEnums(dto.Priority, dto.Category);

        var item = new TodoItem
        {
            Title = NormalizeTitle(dto.Title),
            Description = NormalizeDescription(dto.Description),
            Priority = dto.Priority,
            Category = dto.Category,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.AddAsync(item);
        _logger.LogInformation("Created todo item {Id}: {Title}", created.Id, created.Title);

        return MapToDto(created);
    }

    public async Task<TodoItemDto> UpdateTodoAsync(int id, UpdateTodoDto dto)
    {
        ValidateEnums(dto.Priority, dto.Category);

        var item = await _repository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Todo item with id {id} was not found.");

        item.Title = NormalizeTitle(dto.Title);
        item.Description = NormalizeDescription(dto.Description);
        item.Priority = dto.Priority;
        item.Category = dto.Category;
        item.IsCompleted = dto.IsCompleted;

        await _repository.UpdateAsync(item);
        _logger.LogInformation("Updated todo item {Id}", id);

        return MapToDto(item);
    }

    public async Task DeleteTodoAsync(int id)
    {
        var item = await _repository.GetByIdAsync(id)
            ?? throw new NotFoundException($"Todo item with id {id} was not found.");

        await _repository.DeleteAsync(item);
        _logger.LogInformation("Deleted todo item {Id}", id);
    }

    private static string NormalizeTitle(string title)
    {
        var trimmed = title.Trim();

        if (string.IsNullOrWhiteSpace(trimmed))
            throw new BadRequestException("Title is required.");

        return trimmed;
    }

    private static string? NormalizeDescription(string? description)
    {
        var trimmed = description?.Trim();
        return string.IsNullOrEmpty(trimmed) ? null : trimmed;
    }

    private static void ValidateEnums(PriorityLevel priority, TodoCategory category)
    {
        if (!Enum.IsDefined(priority))
            throw new BadRequestException("Priority must be Low, Medium, or High.");

        if (!Enum.IsDefined(category))
            throw new BadRequestException("Category must be Work, Personal, or Other.");
    }

    private static TodoItemDto MapToDto(TodoItem item) => new()
    {
        Id = item.Id,
        Title = item.Title,
        Description = item.Description,
        Priority = item.Priority,
        Category = item.Category,
        IsCompleted = item.IsCompleted,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
}
