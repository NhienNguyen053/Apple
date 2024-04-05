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
using System.Xml.Linq;

namespace AppleApi.Services
{
    internal class ProductService : CommonRepository<Product>, IProductService
    {
        private readonly ICategoryService categoryService;
        public ProductService(IOptions<AppleDatabaseSettings> settings, ICategoryService categoryService)
        : base(settings, "Product")
        {
            this.categoryService = categoryService;
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

        public async Task<List<Product>> FindCategoryProducts(string categoryId)
        {
            FilterDefinition<Product> filter = Builders<Product>.Filter.Empty;
            Category category = await categoryService.FindByIdAsync(categoryId);
            List<Product> categories = new List<Product>();
            if (category == null)
            {
                return categories;
            }
            else if (category.ParentCategoryId != null)
            {
                filter = filter & Builders<Product>.Filter.Eq(x => x.SubCategoryId, categoryId);
                filter = filter & Builders<Product>.Filter.Eq(x => x.ProductStatus, "Active");
                return await FindManyAsync(filter);
            }
            else
            {
                filter = filter & Builders<Product>.Filter.Eq(x => x.CategoryId, categoryId);
                filter = filter & Builders<Product>.Filter.Eq(x => x.ProductStatus, "Active");
                return await FindManyAsync(filter);
            }
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
