# Todo App

This is a simple todo application built for the assignment.

The backend is a C# ASP.NET Core Web API, the frontend is React, and the data is stored in PostgreSQL. The backend targets **.NET 10** (`net10.0`). I also added a `global.json` file so the project uses SDK `10.0.301`.

## What It Does

- Add a todo item
- View all todo items
- Update an existing todo
- Delete a todo
- Search todos by title or description
- Set priority as Low, Medium, or High
- Set category as Work, Personal, or Other
- Filter todos by category, including View Work and View Personal
- Return clear error messages for invalid requests or missing records

## Project Structure

The backend is split into a few simple layers:

- `Controllers` handles the API routes.
- `Services` contains the main todo logic.
- `Repositories` handles database access using Entity Framework Core.
- `Data` contains the EF Core `DbContext`.
- `Middleware` has the global exception handler.
- `DTOs` contains the request and response objects used by the API.

I kept the controller thin so most of the logic stays in the service layer. The repository is separate from the service so database code is not mixed with business logic.

## Tech Used

- C# / ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- PostgreSQL
- React
- Vite
- Axios
- Docker Compose for local PostgreSQL

## How To Run

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

This starts PostgreSQL on port `5432`.

Database details are in `backend/TodoApi/appsettings.json`:

```text
Database: tododb
Username: postgres
Password: postgres
```

### 2. Run the Backend

```bash
cd backend/TodoApi
dotnet restore
dotnet run
```

The API runs on:

```text
http://localhost:5100
```

Swagger is available here:

```text
http://localhost:5100/swagger
```

The project already has a migration, and the app applies migrations automatically when it starts.

### 3. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The React app runs on:

```text
http://localhost:5173
```

By default, the frontend calls the backend at:

```text
http://localhost:5100/api
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos?search=term` | Search todos |
| GET | `/api/todos?category=Work` | Filter by category |
| GET | `/api/todos?priority=High` | Filter by priority |
| GET | `/api/todos/{id}` | Get one todo |
| GET | `/api/todos/category/{category}` | Get todos by category |
| POST | `/api/todos` | Create a todo |
| PUT | `/api/todos/{id}` | Update a todo |
| DELETE | `/api/todos/{id}` | Delete a todo |

## Error Handling

The API uses a global exception middleware. For example, if a todo is not found, it returns a `404` response with a message instead of exposing a stack trace.

Validation is also handled for required fields like title. Invalid enum values for priority or category are rejected as bad requests.

## Notes

This is currently a single-user todo app, so there is no login or JWT authentication.
