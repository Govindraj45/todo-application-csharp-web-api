namespace TodoApi.Exceptions;

// Thrown when a requested resource doesn't exist. Caught by the exception
// middleware and turned into a 404 with a helpful message.
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}

// Thrown for invalid client input that isn't already caught by model validation.
public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }
}
