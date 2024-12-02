using AppleApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AppleApi.Common;
using AppleApi.Interfaces;
using System.Collections;
using AppleApi.Models.User;

namespace AppleApi.Services
{
    internal class UserService : CommonRepository<User>, IUserService
    {
        public UserService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "User")
        {
        }

        public async Task<bool> TokenExistsAsync(string token)
        {
            var filter = Builders<User>.Filter.Eq("VerificationToken", token);
            var result = await FindAsync(filter);
            return result != null;
        }

        public async Task<User?> UserWithLeastWorkCount(string role, string warehouseId)
        {
            var filter = Builders<User>.Filter.And(
                Builders<User>.Filter.Eq(user => user.Role, role),
                Builders<User>.Filter.Eq(user => user.WarehouseId, warehouseId)
            );
            List<User> users = await FindManyAsync(filter);
            if (users != null)
            {
                User user = users.OrderBy(x => x.WorkCount).First();
                return user;
            }
            else
            {
                return null;
            }
        }
    }
}
