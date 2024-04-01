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
using AppleApi.Models.Product;
using AppleApi.Extensions;
using AppleApi.Models.Category;

namespace AppleApi.Services
{
    internal class ProductService : CommonRepository<Product>, IProductService
    {
        public ProductService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "Product")
        {
        }

        public async Task<List<string>> FindImagesByColorAsync(string id, string color)
        {
            var result = await FindByIdAsync(id);

            if (result != null && result.ProductImages != null)
            {
                var productImage = result.ProductImages.FirstOrDefault(x => x.Color == color);

                if (productImage != null)
                {
                    return productImage.ImageURLs;
                }
            }

            return new List<string>();
        }

        public async Task<Product> FindDifferent(string id, string name)
        {
            FilterDefinition<Product> filter = Builders<Product>.Filter.Empty;
            if (!string.IsNullOrWhiteSpace(id))
            {
                filter = filter & Builders<Product>.Filter.Ne(x => x.Id, id);
            }
            if (!string.IsNullOrWhiteSpace(name))
            {
                filter = filter & Builders<Product>.Filter.Eq(x => x.ProductName, name);
            }
            return await FindAsync(filter);
        }

        public async Task DeleteProductImage(string id, string color, string imageUrl)
        {
            var result = await FindByIdAsync(id);
            if (result != null && result.ProductImages != null)
            {
                ProductImage? productImage = new();
                if (color == "empty")
                {
                    productImage = result.ProductImages.FirstOrDefault(x => x.Color == null);
                }
                else
                {
                    productImage = result.ProductImages.FirstOrDefault(x => x.Color == color);
                }
                if (productImage != null && productImage.ImageURLs != null)
                {
                    productImage.ImageURLs.Remove(imageUrl);
                    await UpdateOneAsync(result.Id.ToString(), result);
                }
            }
        }
    }
}
