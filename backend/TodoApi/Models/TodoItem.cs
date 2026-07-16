namespace TodoApi.Models;

public class TodoItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;

    public TodoCategory Category { get; set; } = TodoCategory.Other;

    public bool IsCompleted { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
