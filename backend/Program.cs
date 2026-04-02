var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowAll");

app.MapGet("/api/movies", () =>
{
    var movies = new[]
    {
        new { id = 1, title = "Inception", genre = "Sci-Fi" },
        new { id = 2, title = "Interstellar", genre = "Sci-Fi" },
        new { id = 3, title = "Batman", genre = "Action" }
    };

    return Results.Ok(movies);
});

app.Run();