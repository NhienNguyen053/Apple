using AppleApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq.Expressions;
using Twilio.Jwt.AccessToken;

namespace Apple.Services
{
    public class MongoService<T>
    {
        protected readonly IMongoCollection<T> _collection;
        private readonly string _idPropertyName = "Id";

        public MongoService(IOptions<AppleDatabaseSettings> settings, string collectionName)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _collection = database.GetCollection<T>(collectionName);
        }

        public async Task<List<T>> GetAsync() =>
            await _collection.Find(_ => true).ToListAsync();

        public async Task<T?> GetAsync(string id)
        {
            ObjectId.TryParse(id, out var objectId);
            var filter = Builders<T>.Filter.Eq("_id", objectId);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByAsync(string field, string search)
        {
            var filter = Builders<T>.Filter.Eq(field, search);
            var result = await _collection.Find(filter).FirstOrDefaultAsync();
            return result as User;
        }
        public async Task<Category?> GetCategoryByIdAsync(string field, string id)
        {
            ObjectId.TryParse(id, out var objectId);
            var filter = Builders<T>.Filter.Eq(field, objectId);
            var result = await _collection.Find(filter).FirstOrDefaultAsync(); 
            return result as Category;
        }

        public async Task<bool> TokenExistsAsync(string token)
        {
            var filter = Builders<T>.Filter.Eq("VerificationToken", token);
            var result = await _collection.Find(filter).AnyAsync();
            return result;
        }

        public async Task<T> CreateAsync(T document)
        {
            await _collection.InsertOneAsync(document);
            return document;
        }


        public async Task UpdateAsync(string id, T updatedDocument)
        {
            ObjectId.TryParse(id, out var objectId);
            var filter = Builders<T>.Filter.Eq("_id", objectId);
            await _collection.ReplaceOneAsync(filter, updatedDocument);
        }

        public async Task RemoveAsync(string id)
        {
            ObjectId.TryParse(id, out var objectId);
            var filter = Builders<T>.Filter.Eq("_id", objectId);
            await _collection.DeleteOneAsync(filter);
        }
    }
}
