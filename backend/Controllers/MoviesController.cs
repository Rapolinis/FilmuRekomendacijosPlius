using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Dapper;
using System.Text.Json;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly MySqlConnection _db;

    public MoviesController(MySqlConnection db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var movies = await _db.QueryAsync<Movie>("SELECT * FROM movies ORDER BY id");

        var result = movies.Select(m => new
        {
            id = m.Id,
            title = m.Title,
            originalTitle = m.OriginalTitle,
            description = m.Description,
            genre = ParseJson<List<string>>(m.GenreJson, new List<string>()),
            director = m.Director,
            actors = ParseJson<List<string>>(m.ActorsJson, new List<string>()),
            duration = m.Duration,
            releaseDate = m.ReleaseDate,
            rating = m.Rating,
            ratings = ParseJson<List<double>>(m.RatingsJson, new List<double>()),
            imdbRating = m.ImdbRating,
            poster = m.Poster,
            comments = ParseJson<List<JsonElement>>(m.CommentsJson, new List<JsonElement>()),
            foodRecommendation = string.IsNullOrEmpty(m.FoodRecommendationJson)
                ? null
                : ParseJson<JsonElement?>(m.FoodRecommendationJson, null),
            category = m.Category
        });

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var movie = await _db.QueryFirstOrDefaultAsync<Movie>(
            "SELECT * FROM movies WHERE id = @id", new { id });

        if (movie == null) return NotFound();

        var result = new
        {
            id = movie.Id,
            title = movie.Title,
            originalTitle = movie.OriginalTitle,
            description = movie.Description,
            genre = ParseJson<List<string>>(movie.GenreJson, new List<string>()),
            director = movie.Director,
            actors = ParseJson<List<string>>(movie.ActorsJson, new List<string>()),
            duration = movie.Duration,
            releaseDate = movie.ReleaseDate,
            rating = movie.Rating,
            ratings = ParseJson<List<double>>(movie.RatingsJson, new List<double>()),
            imdbRating = movie.ImdbRating,
            poster = movie.Poster,
            comments = ParseJson<List<JsonElement>>(movie.CommentsJson, new List<JsonElement>()),
            foodRecommendation = string.IsNullOrEmpty(movie.FoodRecommendationJson)
                ? null
                : ParseJson<JsonElement?>(movie.FoodRecommendationJson, null),
            category = movie.Category
        };

        return Ok(result);
    }

    private static T ParseJson<T>(string? json, T fallback)
    {
        if (string.IsNullOrWhiteSpace(json)) return fallback;
        try { return JsonSerializer.Deserialize<T>(json) ?? fallback; }
        catch { return fallback; }
    }
}
