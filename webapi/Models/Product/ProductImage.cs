using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace AppleApi.Models.Product
{
    public class ProductImage
    {
        public string? Color { get; set; }
        public List<string> ImageURLs { get; set; } = null!;
    }
}
