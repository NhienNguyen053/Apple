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
        Task<List<Product>> FindCategoryProducts(string categoryId);
        Task<Product> FindProductByName(string category, string name);
        Task<(List<Product>, long)> FindProductsByFilter(string categoryId, string subcategoryId, string price, string status, string name, int pageIndex, int pageSize);
        Task<List<Product>> FindRelatedProducts(string subcategoryId, string id);
        Task DeleteProductImage(string id, string color, string imageUrl);
    }
}
