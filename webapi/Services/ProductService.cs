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
using System.Text.RegularExpressions;

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
                if (color != null)
                {
                    var productImage = result.ProductImages.FirstOrDefault(x => x.Color == color);

                    if (productImage != null)
                    {
                        return productImage.ImageURLs;
                    }
                }
                else
                {
                    var productImage = result.ProductImages.FirstOrDefault();

                    if (productImage != null)
                    {
                        return productImage.ImageURLs;
                    }
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

        public async Task<Product> FindProductByName(string categoryName, string productName)
        {
            FilterDefinition<Category> categoryFilter = Builders<Category>.Filter.Empty;
            FilterDefinition<Product> productFilter = Builders<Product>.Filter.Empty;
            Category category = new Category();

            if (!string.IsNullOrWhiteSpace(categoryName))
            {
                var escapedName = Regex.Escape(categoryName);
                var normalizedPattern = escapedName.Replace("-", "\\s");
                var regexPattern = $"^{normalizedPattern}$";
                var regex = new BsonRegularExpression(regexPattern, "i");
                categoryFilter = Builders<Category>.Filter.Regex(x => x.CategoryName, regex);
            }
            category = await categoryService.FindAsync(categoryFilter);
            if (category != null)
            {
                if (!string.IsNullOrWhiteSpace(productName))
                {
                    var escapedName = Regex.Escape(productName);
                    var normalizedPattern = escapedName.Replace("-", "\\s");
                    var regexPattern = $"^{normalizedPattern}$";
                    var regex = new BsonRegularExpression(regexPattern, "i");
                    productFilter = Builders<Product>.Filter.Regex(x => x.ProductName, regex);
                    productFilter = productFilter & Builders<Product>.Filter.Eq(p => p.SubCategoryId, category.Id);
                    productFilter = productFilter & Builders<Product>.Filter.Eq(p => p.ProductStatus, "Active");
                }
            }
            return await FindAsync(productFilter);
        }

        public async Task<(List<Product>, long)> FindProductsByFilter(string categoryId, string subcategoryId, string price, string status, string name, int pageIndex, int pageSize)
        {
            FilterDefinition<Product> filter = Builders<Product>.Filter.Empty;
            long totalCount;
            List<Product> products = new List<Product>();

            if (!string.IsNullOrEmpty(categoryId))
            {
                filter = filter & Builders<Product>.Filter.Eq(p => p.CategoryId, categoryId);
            }
            if (!string.IsNullOrEmpty(subcategoryId))
            {
                filter = filter & Builders<Product>.Filter.Eq(p => p.SubCategoryId, subcategoryId);
            }
            if (!string.IsNullOrEmpty(status))
            {
                filter = filter & Builders<Product>.Filter.Eq(p => p.ProductStatus, status);
            }
            if (!string.IsNullOrEmpty(price))
            {
                if (decimal.TryParse(price, out decimal parsedPrice))
                {
                    filter = filter & Builders<Product>.Filter.Lt(p => decimal.Parse(p.ProductPrice), parsedPrice);
                }
            }
            if (!string.IsNullOrEmpty(name))
            {
                var regexPattern = new BsonRegularExpression(new Regex(name, RegexOptions.IgnoreCase));
                filter = filter & Builders<Product>.Filter.Regex(p => p.ProductName, regexPattern);
            }
            (products, totalCount) = await FindManyWithPaging(filter, pageSize, pageIndex);
            return (products, totalCount);
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
