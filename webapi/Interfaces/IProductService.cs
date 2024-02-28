using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;
using webapi.Models.Product;

namespace AppleApi.Interfaces
{
    public interface IProductService : ICommonRepository<Product>
    {
        Task<List<string>> FindImagesByColorAsync(string id, string color);
        Task DeleteProductImage(string id, string color, string imageUrl);
    }
}
