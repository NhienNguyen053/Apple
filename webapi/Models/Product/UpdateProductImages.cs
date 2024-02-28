using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace webapi.Models.Product;

public class UpdateProductImages
{
    public string productId { get; set; } = null!;
    public List<string> productImages { get; set; } = null!;
    public string? Color { get; set; }
}