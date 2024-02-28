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
using webapi.Models.Category;

namespace AppleApi.Services
{
    internal class CategoryService : CommonRepository<Category>, ICategoryService
    {
        public CategoryService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "Category")
        {
        }
    }
}
