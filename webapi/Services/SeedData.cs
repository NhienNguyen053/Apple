using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using AppleApi.Services;
using AppleApi.Models.User;
using System.Security.Cryptography;
using AppleApi.Interfaces;
using AppleApi.Models.Warehouse;

namespace AppleApi.Services
{
    public static class SeedData
    {
        public static async Task SeedDatabaseIfEmpty(IServiceProvider serviceProvider, IUserService userService)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var users = await userService.GetAll();
                if (users == null || users.Count == 0)
                {
                    CreatePasswordHash("Gardevoir123", out byte[] passwordHash, out byte[] passwordSalt);
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
                        ShippingData = new ShippingData {
                            FirstName = "Nhien",
                            LastName = "Nguyen",
                            StreetAddress = "asd",
                            EmailAddress = "nhiennguyen3999@gmail.com",
                            PhoneNumber = "+84967835585"
                        },
                        Role = "User Manager"
                    };
                    await userService.InsertOneAsync(user);
                }
            }
        }

        public static async Task SeedWarehouseIfEmpty(IServiceProvider serviceProvider, IWarehouseService warehouseService)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var warehouses = await warehouseService.GetAll();
                if (warehouses == null || warehouses.Count == 0)
                {
                    var newWarehouses = new List<Warehouse>()
                    {
                        new Warehouse { Name = "Warehouse North", Address = "Ha Noi, Viet Nam" },
                        new Warehouse { Name = "Warehouse West", Address = "Da Nang, Viet Nam" },
                        new Warehouse { Name = "Warehouse South", Address = "TP Ho Chi Minh, Viet Nam" }
                    };
                    await warehouseService.InsertManyAsync(newWarehouses);
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
