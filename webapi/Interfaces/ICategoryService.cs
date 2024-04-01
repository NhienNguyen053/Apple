using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;
using AppleApi.Models.Category;

namespace AppleApi.Interfaces
{
    public interface ICategoryService : ICommonRepository<Category>
    {
        Task<Category> FindDifferent(string id, string name);
    }
}
