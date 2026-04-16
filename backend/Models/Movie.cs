namespace backend.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string OriginalTitle { get; set; } = "";
    public string Description { get; set; } = "";
    public string? GenreJson { get; set; }
    public string Director { get; set; } = "";
    public string? ActorsJson { get; set; }
    public int Duration { get; set; }
    public string ReleaseDate { get; set; } = "";
    public double Rating { get; set; }
    public string? RatingsJson { get; set; }
    public double ImdbRating { get; set; }
    public string Poster { get; set; } = "";
    public string? CommentsJson { get; set; }
    public string? FoodRecommendationJson { get; set; }
    public string Category { get; set; } = "";
}
