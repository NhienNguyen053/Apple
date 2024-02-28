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
using webapi.Models.Product;

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

        public async Task DeleteProductImage(string id, string color, string imageUrl)
        {
            var result = await FindByIdAsync(id);
            if (result != null && result.ProductImages != null)
            {
                var productImage = result.ProductImages.FirstOrDefault(x => x.Color == color);
                if (productImage != null && productImage.ImageURLs != null)
                {
                    result.ProductImages.FirstOrDefault(x => x.Color == color)!.ImageURLs.Remove(imageUrl);
                    await UpdateOneAsync(result.Id, result);
                }
            }
        }
    }
}
