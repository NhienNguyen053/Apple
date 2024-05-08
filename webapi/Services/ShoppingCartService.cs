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
using System.Collections;
using AppleApi.Models.User;
using AppleApi.Models.ShoppingCart;
using AppleApi.Models.Product;
using System.Xml.Linq;

namespace AppleApi.Services
{
    internal class ShoppingCartService : CommonRepository<ShoppingCart>, IShoppingCartService
    {
        public ShoppingCartService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "ShoppingCart")
        {
        }

        public async Task<ShoppingCart> FindCartByFilter(string userId, string productId, string? color, string? memory, string? storage)
        {
            FilterDefinition<ShoppingCart> filter = Builders<ShoppingCart>.Filter.Empty;
            if (!string.IsNullOrWhiteSpace(userId))
            {
                filter = filter & Builders<ShoppingCart>.Filter.Eq(x => x.UserId, userId);
            }
            if (!string.IsNullOrWhiteSpace(productId))
            {
                filter = filter & Builders<ShoppingCart>.Filter.Eq(x => x.ProductId, productId);
            }
            if (!string.IsNullOrWhiteSpace(color))
            {
                filter = filter & Builders<ShoppingCart>.Filter.Eq(x => x.Color, color);
            }
            if (!string.IsNullOrWhiteSpace(memory))
            {
                filter = filter & Builders<ShoppingCart>.Filter.Eq(x => x.Memory, memory);
            }
            if (!string.IsNullOrWhiteSpace(storage))
            {
                filter = filter & Builders<ShoppingCart>.Filter.Eq(x => x.Storage, storage);
            }
            return await FindAsync(filter);
        }
    }
}
