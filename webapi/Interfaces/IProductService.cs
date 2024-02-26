using AppleApi.Models;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;

namespace AppleApi.Interfaces
{
    public interface IProductService : ICommonRepository<Product>
    {
        Task<List<string>> FindImagesByColorAsync(string id, string color);
    }
}
