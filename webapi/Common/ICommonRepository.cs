using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AppleApi.Common
{
    public interface ICommonRepository<T>
    {
        Task<List<T>> GetAll();
        Task<T> FindByIdAsync(string id);
        Task<T> InsertOneAsync(T model);
    }
}
