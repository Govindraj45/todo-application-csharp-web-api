using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data;

public class TodoDbContext : DbContext
{
    public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.Property(t => t.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(t => t.Description)
                  .HasMaxLength(2000);

            // Store enums as strings so the raw table data is readable and
            // reordering the enum later doesn't silently change stored values.
            entity.Property(t => t.Priority)
                  .HasConversion<string>()
                  .HasMaxLength(20);

            entity.Property(t => t.Category)
                  .HasConversion<string>()
                  .HasMaxLength(20);

            // Indexes to support search/filter queries efficiently.
            entity.HasIndex(t => t.Category);
            entity.HasIndex(t => t.Priority);
            entity.HasIndex(t => t.Title);
        });
    }
}
