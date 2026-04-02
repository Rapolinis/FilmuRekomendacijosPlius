using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var movies = new[]
        {
            new { id = 1, title = "Inception", genre = "Sci-Fi" },
            new { id = 2, title = "Interstellar", genre = "Sci-Fi" },
            new { id = 3, title = "Batman", genre = "Action" }
        };

        return Ok(movies);
    }
}