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
using AppleApi.Models.Category;
using AppleApi.Extensions;

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
    }
}
