﻿using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AppleApi.Common
{
    public interface ICommonRepository<T>
    {
        Task<List<T>> GetAll();
        Task<T> FindAsync(FilterDefinition<T> filter);
        Task<List<T>> FindManyAsync(FilterDefinition<T> filter);
        Task<T> FindByIdAsync(string id);
        Task<T> FindByFieldAsync(string field, string value);
        Task<List<T>> FindManyByFieldAsync(string field, string value);
        Task<List<T>> FindManyByListId(List<string> ids);
        Task<T> FindNewest(string field);
        Task<List<T>> GetPagedAsync(int page, int pageSize, FilterDefinition<T>? filter = null);
        Task<T> InsertOneAsync(T model);
        Task<List<T>> InsertManyAsync(List<T> model);
        Task UpdateOneAsync(string id, T model);
        Task<T> DeleteOneAsync(string id);
        Task DeleteByFieldAsync(string field, string value);
    }
}
