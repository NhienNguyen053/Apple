using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AppleApi.Models.ShoppingCart;

public class ChangeCart
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    public int Quantity { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? UserId { get; set; }
}