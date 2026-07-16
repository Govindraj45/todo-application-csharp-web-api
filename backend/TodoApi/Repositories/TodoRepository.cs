using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Repositories;

// Repository is the only layer that talks to EF Core / the DbContext.
// Services build business rules on top of this without knowing about EF at all.
public class TodoRepository : ITodoRepository
{
    private readonly TodoDbContext _context;

    public TodoRepository(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<List<TodoItem>> GetAllAsync(string? search, TodoCategory? category, PriorityLevel? priority)
    {
        IQueryable<TodoItem> query = _context.TodoItems.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(t =>
                t.Title.ToLower().Contains(term) ||
                (t.Description != null && t.Description.ToLower().Contains(term)));
        }

        if (category.HasValue)
            query = query.Where(t => t.Category == category.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<TodoItem?> GetByIdAsync(int id)
    {
        return await _context.TodoItems.FindAsync(id);
    }

    public async Task<TodoItem> AddAsync(TodoItem item)
    {
        _context.TodoItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task UpdateAsync(TodoItem item)
    {
        item.UpdatedAt = DateTime.UtcNow;
        _context.TodoItems.Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(TodoItem item)
    {
        _context.TodoItems.Remove(item);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.TodoItems.AnyAsync(t => t.Id == id);
    }
}
