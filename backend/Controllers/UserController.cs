using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Dapper;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly MySqlConnection _db;

    public UsersController(MySqlConnection db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var users = await _db.QueryAsync(@"
            SELECT 
                id,
                username,
                email,
                role,
                avatar,
                blocked,
                blocked_reason AS blockedReason,
                blocked_until AS blockedUntil,
                created_at AS createdAt
            FROM users
            ORDER BY id;
        ");

        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> Create(RegisterUserDto user)
    {
        var passwordHash = HashPassword(user.Password);

        var sql = @"
            INSERT INTO users 
            (username, email, password_hash, role, avatar, blocked, blocked_reason, blocked_until, created_at)
            VALUES
            (@Username, @Email, @PasswordHash, 'viewer', '', false, '', NULL, CURDATE());

            SELECT LAST_INSERT_ID();
        ";

        var id = await _db.ExecuteScalarAsync<int>(sql, new
        {
            user.Username,
            user.Email,
            PasswordHash = passwordHash
        });

        return Ok(new
        {
            id,
            user.Username,
            user.Email,
            role = "viewer",
            avatar = "",
            blocked = false,
            blockedReason = "",
            blockedUntil = (DateTime?)null,
            createdAt = DateTime.Today
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto login)
    {
        var passwordHash = HashPassword(login.Password);

        var user = await _db.QueryFirstOrDefaultAsync(@"
            SELECT 
                id,
                username,
                email,
                role,
                avatar,
                blocked,
                blocked_reason AS blockedReason,
                blocked_until AS blockedUntil
            FROM users
            WHERE email = @Email AND password_hash = @PasswordHash
            LIMIT 1;
        ", new
        {
            login.Email,
            PasswordHash = passwordHash
        });

        if (user == null)
            return Unauthorized(new { message = "Neteisingas el. paštas arba slaptažodis." });

        if (user.blocked == true)
            return Unauthorized(new { message = "Vartotojas užblokuotas." });

        return Ok(user);
    }

    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes).ToLower();
    }
}

public class RegisterUserDto
{
    public string Username { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

public class LoginDto
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}