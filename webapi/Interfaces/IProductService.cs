using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;
using AppleApi.Models.Product;

namespace AppleApi.Interfaces
{
    public interface IProductService : ICommonRepository<Product>
    {
        Task<List<string>> FindImagesByColorAsync(string id, string color);
        Task<Product> FindDifferent(string id, string name);
        Task DeleteProductImage(string id, string color, string imageUrl);
    }
}
