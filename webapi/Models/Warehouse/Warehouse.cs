using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AppleApi.Models.Warehouse;

public class Warehouse
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;

}