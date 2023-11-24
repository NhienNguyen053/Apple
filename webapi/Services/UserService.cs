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

namespace AppleApi.Services
{
    internal class UserService : CommonRepository<User>, IUserService
    {
        public UserService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "User")
        {
        }
    }
}
