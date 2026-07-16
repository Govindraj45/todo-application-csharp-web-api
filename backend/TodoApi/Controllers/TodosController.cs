using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _service;

    public TodosController(ITodoService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all todos. Supports search and filtering by category/priority.
    /// GET /api/todos
    /// GET /api/todos?search=milk
    /// GET /api/todos?category=Work
    /// GET /api/todos?priority=High
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<TodoItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TodoItemDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] TodoCategory? category,
        [FromQuery] PriorityLevel? priority)
    {
        var todos = await _service.GetTodosAsync(search, category, priority);
        return Ok(todos);
    }

    /// <summary>
    /// Convenience endpoint backing the "View Work" / "View Personal" buttons.
    /// GET /api/todos/category/Work
    /// </summary>
    [HttpGet("category/{category}")]
    [ProducesResponseType(typeof(List<TodoItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<TodoItemDto>>> GetByCategory(TodoCategory category)
    {
        var todos = await _service.GetTodosAsync(search: null, category: category, priority: null);
        return Ok(todos);
    }

    /// <summary>
    /// GET /api/todos/{id}
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TodoItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoItemDto>> GetById(int id)
    {
        var todo = await _service.GetTodoByIdAsync(id);
        return Ok(todo);
    }

    /// <summary>
    /// POST /api/todos
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(TodoItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoItemDto>> Create([FromBody] CreateTodoDto dto)
    {
        // [ApiController] auto-returns 400 with validation details for invalid ModelState.
        var created = await _service.CreateTodoAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// PUT /api/todos/{id}
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TodoItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TodoItemDto>> Update(int id, [FromBody] UpdateTodoDto dto)
    {
        var updated = await _service.UpdateTodoAsync(id, dto);
        return Ok(updated);
    }

    /// <summary>
    /// DELETE /api/todos/{id}
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteTodoAsync(id);
        return NoContent();
    }
}
