﻿using AppleApi.Models;
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
using AppleApi.Models.Category;
using AppleApi.Extensions;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace AppleApi.Services
{
    internal class CategoryService : CommonRepository<Category>, ICategoryService
    {
        public CategoryService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "Category")
        {
        }

        public async Task<Category> FindDifferent(string id, string name)
        {
            FilterDefinition<Category> filter = Builders<Category>.Filter.Empty;
            if (!string.IsNullOrWhiteSpace(id))
            {
                filter = filter & Builders<Category>.Filter.Ne(x => x.Id, id);
            }
            if (!string.IsNullOrWhiteSpace(name))
            {
                filter = filter & Builders<Category>.Filter.Eq(x => x.CategoryName, name);
            }
            return await FindAsync(filter);
        }

        public async Task<Category> FindCategoryByName(string name)
        {
            FilterDefinition<Category> filter = Builders<Category>.Filter.Empty;

            if (!string.IsNullOrWhiteSpace(name))
            {
                var escapedName = Regex.Escape(name);
                var normalizedPattern = escapedName.Replace("-", "\\s");
                var regexPattern = $"^{normalizedPattern}$";
                var regex = new BsonRegularExpression(regexPattern, "i");
                filter = Builders<Category>.Filter.Regex(x => x.CategoryName, regex);
            }
            return await FindAsync(filter);
        }

        public async Task<List<Category>> FindSubcategory(string parentId)
        {
            FilterDefinition<Category> filter = Builders<Category>.Filter.Empty;
            if (!string.IsNullOrWhiteSpace(parentId))
            {
                filter = filter & Builders<Category>.Filter.Or(Builders<Category>.Filter.Eq(x => x.Id, parentId), Builders<Category>.Filter.Eq(x => x.ParentCategoryId, parentId));
            }
            return await FindManyAsync(filter);
        }
    }
}
