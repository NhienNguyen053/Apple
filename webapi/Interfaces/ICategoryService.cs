using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;
using webapi.Models.Category;

namespace AppleApi.Interfaces
{
    public interface ICategoryService : ICommonRepository<Category>
    {
    }
}
