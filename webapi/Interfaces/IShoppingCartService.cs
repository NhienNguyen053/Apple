using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;
using AppleApi.Models.User;
using AppleApi.Models.ShoppingCart;
using AppleApi.Models.Product;

namespace AppleApi.Interfaces
{
    public interface IShoppingCartService : ICommonRepository<ShoppingCart>
    {
        Task<ShoppingCart> FindCartByFilter(string userId, string productId, string? color, string? memory, string? storage);
    }
}
