using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Apple.Services;
using AppleApi.Models;
using System.Security.Cryptography;

namespace Apple.Services
{
    public static class SeedData
    {
        public static async Task SeedDatabaseIfEmpty(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<UserService>();

                var users = await userService.GetAsync();
                CreatePasswordHash("123456789", out byte[] passwordHash, out byte[] passwordSalt); // account password
                if (users == null || users.Count == 0)
                {
                    var user = new User
                    {
                        FirstName = "Admin",
                        LastName = "Admin",
                        Country = "Vietnam",
                        Birthday = DateTime.MinValue,
                        Email = "admin123@gmail.com",
                        PhoneNumber = "0956473848",
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt,
                        VerificationToken = null!,
                        VerificationTokenExpires = DateTime.MinValue,
                        VerifiedAt = DateTime.Now,
                        PasswordResetToken = null!,
                        ResetTokenExpires = DateTime.Now,
                        Role = "Admin"
                    };

                    await userService.CreateAsync(user);
                }
            }
        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
