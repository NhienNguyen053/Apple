using AppleApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace AppleApi.Common
{
    public class CommonRepository<T> : ICommonRepository<T>
    {
        private readonly IMongoCollection<T> _collection;
        public CommonRepository(IOptions<AppleDatabaseSettings> settings, string collectionName)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<T>(collectionName);
        }

        public async Task<List<T>> GetAll()
        {
            List<T> doc = await _collection.Find(_ => true).ToListAsync();
            return doc;
        }

        public async Task<T> FindAsync(FilterDefinition<T> filter)
        {
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<List<T>> FindManyAsync(FilterDefinition<T> filter)
        {
            return await _collection.Find(filter).ToListAsync();
        }

        public async Task<T> FindByIdAsync(string id)
        {
            if (!string.IsNullOrWhiteSpace(id))
            {
                FilterDefinition<T> filter = FilterById(id);
                T doc = await _collection.Find(filter).FirstOrDefaultAsync();
                return doc;
            }
            return default!;
        }

        public async Task<T> FindNewest(string field)
        {
            FilterDefinition<T> filter = Builders<T>.Filter.Empty;
            var sort = Builders<T>.Sort.Descending(field);
            T doc = await _collection.Find(filter).Sort(sort).FirstOrDefaultAsync();
            return doc;
        }

        public async Task<T> FindByFieldAsync(string field, string value)
        {
            FilterDefinition<T> filter = Builders<T>.Filter.Eq(field, value);
            T doc = await _collection.Find(filter).FirstOrDefaultAsync();
            return doc;
        }

        public async Task<T> InsertOneAsync(T model)
        {
            await _collection.InsertOneAsync(model);
            return model;
        }

        public async Task UpdateOneAsync(string id, T model)
        {
            ObjectId.TryParse(id, out var objectId);
            var filter = Builders<T>.Filter.Eq("_id", objectId);
            await _collection.ReplaceOneAsync(filter, model);
        }

        public async Task<T> DeleteOneAsync(string id)
        {
            FilterDefinition<T> filter = FilterById(id);
            T result = await _collection.FindOneAndDeleteAsync(filter);
            return result;
        }

        private FilterDefinition<T> FilterById(string id)
        {
            FilterDefinition<T> filter = Builders<T>.Filter.Where(x => BsonBoolean.False.Value);
            if (!string.IsNullOrWhiteSpace(id))
            {
                if (ObjectId.TryParse(id, out ObjectId out_objectId))
                {
                    if (out_objectId == ObjectId.Empty)
                    {
                        out_objectId = ObjectId.GenerateNewId();
                    }
                    filter = Builders<T>.Filter.Eq("_id", out_objectId);
                }
                else if (int.TryParse(id, out int _idInt))
                {
                    filter = FilterById(_idInt);
                }
                else
                {
                    filter = Builders<T>.Filter.Eq("_id", id);
                }
            }
            return filter;
        }

        private FilterDefinition<T> FilterById(int _idInt)
        {
            FilterDefinition<T> filter = Builders<T>.Filter.Eq("_id", _idInt);
            return filter;
        }
    }
}
