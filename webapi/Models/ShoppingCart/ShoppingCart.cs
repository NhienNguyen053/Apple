using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AppleApi.Models.ShoppingCart;

public class ShoppingCart
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    public string? Color { get; set; }
    public string? Memory { get; set; }
    public string? Storage { get; set; }
    public int Quantity { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductId { get; set; } = null!;
}