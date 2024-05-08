using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AppleApi.Models.ShoppingCart;

public class RemoveCart
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? UserId { get; set; }
}