using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;
using AppleApi.Models.User;

namespace AppleApi.Interfaces
{
    public interface IUserService : ICommonRepository<User>
    {
        Task<bool> TokenExistsAsync(string token);
    }
}
