using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using AppleApi.Services;
using AppleApi.Models;
using System.Security.Cryptography;
using AppleApi.Interfaces;

namespace AppleApi.Services
{
    public static class SeedData
    {
        public static async Task SeedDatabaseIfEmpty(IServiceProvider serviceProvider, IUserService userService)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var users = await userService.GetAll();
                CreatePasswordHash("123456789", out byte[] passwordHash, out byte[] passwordSalt);
                if (users == null || users.Count == 0)
                {
                    var user = new User
                    {
                        FirstName = "Nhien",
                        LastName = "Nguyen",
                        Country = "Vietnam",
                        Birthday = DateTime.MinValue,
                        Email = "nhiennguyen3999@gmail.com",
                        PhoneNumber = "+84967835585",
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt,
                        VerificationToken = null,
                        VerificationTokenExpires = null,
                        VerifiedAt = DateTime.Now,
                        PasswordResetToken = null,
                        ResetTokenExpires = null,
                        Role = "Admin"
                    };

                    await userService.InsertOneAsync(user);
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
