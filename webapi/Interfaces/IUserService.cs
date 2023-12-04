using AppleApi.Models;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;

namespace AppleApi.Interfaces
{
    public interface IUserService : ICommonRepository<User>
    {
        Task<bool> TokenExistsAsync(string token);
    }
}
