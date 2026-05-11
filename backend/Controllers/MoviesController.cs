using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Dapper;

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
        var movies = await _db.QueryAsync<MovieDto>(@"
            SELECT 
                m.id,
                m.title,
                m.original_title AS originalTitle,
                m.description,
                m.director,
                m.duration,
                m.release_date AS releaseDate,
                m.rating,
                m.imdb_rating AS imdbRating,
                m.poster,
                m.food_name AS foodName,
                m.food_wolt_link AS foodWoltLink,
                c.name AS category
            FROM movies m
            LEFT JOIN categories c ON c.id = m.category_id
            ORDER BY m.id;
        ");

        foreach (var movie in movies)
        {
            movie.Genre = (await _db.QueryAsync<string>(@"
                SELECT g.name
                FROM movie_genres mg
                JOIN genres g ON g.id = mg.genre_id
                WHERE mg.movie_id = @movieId;
            ", new { movieId = movie.Id })).ToList();

            movie.Actors = (await _db.QueryAsync<string>(@"
                SELECT actor_name
                FROM movie_actors
                WHERE movie_id = @movieId;
            ", new { movieId = movie.Id })).ToList();

            movie.Ratings = (await _db.QueryAsync<int>(@"
                SELECT rating
                FROM movie_ratings
                WHERE movie_id = @movieId;
            ", new { movieId = movie.Id })).ToList();

            movie.Comments = (await _db.QueryAsync<CommentDto>(@"
                SELECT 
                    user_id AS userId,
                    text,
                    created_at AS date
                FROM comments
                WHERE movie_id = @movieId;
            ", new { movieId = movie.Id })).ToList();

            movie.FoodRecommendation = new FoodRecommendationDto
            {
                Name = movie.FoodName,
                WoltLink = movie.FoodWoltLink
            };
        }

        return Ok(movies);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var movie = await _db.QueryFirstOrDefaultAsync<MovieDto>(@"
            SELECT 
                m.id,
                m.title,
                m.original_title AS originalTitle,
                m.description,
                m.director,
                m.duration,
                m.release_date AS releaseDate,
                m.rating,
                m.imdb_rating AS imdbRating,
                m.poster,
                m.food_name AS foodName,
                m.food_wolt_link AS foodWoltLink,
                c.name AS category
            FROM movies m
            LEFT JOIN categories c ON c.id = m.category_id
            WHERE m.id = @id;
        ", new { id });

        if (movie == null)
            return NotFound();

        movie.Genre = (await _db.QueryAsync<string>(@"
            SELECT g.name
            FROM movie_genres mg
            JOIN genres g ON g.id = mg.genre_id
            WHERE mg.movie_id = @movieId;
        ", new { movieId = movie.Id })).ToList();

        movie.Actors = (await _db.QueryAsync<string>(@"
            SELECT actor_name
            FROM movie_actors
            WHERE movie_id = @movieId;
        ", new { movieId = movie.Id })).ToList();

        movie.Ratings = (await _db.QueryAsync<int>(@"
            SELECT rating
            FROM movie_ratings
            WHERE movie_id = @movieId;
        ", new { movieId = movie.Id })).ToList();

        movie.Comments = (await _db.QueryAsync<CommentDto>(@"
            SELECT 
                user_id AS userId,
                text,
                created_at AS date
            FROM comments
            WHERE movie_id = @movieId;
        ", new { movieId = movie.Id })).ToList();

        movie.FoodRecommendation = new FoodRecommendationDto
        {
            Name = movie.FoodName,
            WoltLink = movie.FoodWoltLink
        };

        return Ok(movie);
    }
}

public class MovieDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string OriginalTitle { get; set; } = "";
    public string Description { get; set; } = "";
    public List<string> Genre { get; set; } = new();
    public string Director { get; set; } = "";
    public List<string> Actors { get; set; } = new();
    public int Duration { get; set; }
    public DateTime ReleaseDate { get; set; }
    public decimal Rating { get; set; }
    public List<int> Ratings { get; set; } = new();
    public decimal ImdbRating { get; set; }
    public string Poster { get; set; } = "";
    public List<CommentDto> Comments { get; set; } = new();
    public FoodRecommendationDto? FoodRecommendation { get; set; }
    public string Category { get; set; } = "";

    public string FoodName { get; set; } = "";
    public string FoodWoltLink { get; set; } = "";
}

public class CommentDto
{
    public int UserId { get; set; }
    public string Text { get; set; } = "";
    public DateTime Date { get; set; }
}

public class FoodRecommendationDto
{
    public string Name { get; set; } = "";
    public string WoltLink { get; set; } = "";
}