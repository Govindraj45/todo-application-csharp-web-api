using System.ComponentModel.DataAnnotations;
using TodoApi.Models;

namespace TodoApi.DTOs;

// What the API returns. Keeping a separate "read" shape from the entity is good
// practice: it stops the DB model leaking into the public contract.
public class TodoItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public PriorityLevel Priority { get; set; }
    public TodoCategory Category { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// What the client sends to create a todo.
public class CreateTodoDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string? Description { get; set; }

    public PriorityLevel Priority { get; set; } = PriorityLevel.Medium;

    public TodoCategory Category { get; set; } = TodoCategory.Other;
}

// What the client sends to update a todo. All fields are required here because
// PUT is a full replace; use PATCH-style partial DTO if you need partial updates.
public class UpdateTodoDto
{
    [Required(ErrorMessage = "Title is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
    public string? Description { get; set; }

    public PriorityLevel Priority { get; set; }

    public TodoCategory Category { get; set; }

    public bool IsCompleted { get; set; }
}
