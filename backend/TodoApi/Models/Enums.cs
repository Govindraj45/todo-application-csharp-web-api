namespace TodoApi.Models;

// Priority levels required by the assignment.
// Stored as string in the DB (see TodoDbContext) so the data is human-readable
// and the enum can be reordered later without a data migration.
public enum PriorityLevel
{
    Low,
    Medium,
    High
}

// Categories required by the assignment ("View Work" / "View Personal" buttons on the frontend).
public enum TodoCategory
{
    Work,
    Personal,
    Other
}
