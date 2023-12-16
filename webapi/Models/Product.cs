using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace AppleApi.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        public int ProductNumber { get; set; }
        public string ProductName { get; set; } = null!;
        public string ProductPrice { get; set; } = null!;
        public string ProductQuantity { get; set; } = null!;
        public string ProductStatus { get; set; } = null!;
        public string CategoryId { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public List<string> Colors { get; set; } = null!;
        public Specification Specification { get; set; } = null!;
        public List<string> ProductImages { get; set; } = null!;
        public List<BoxItem> BoxItems { get; set; } = null!;
    }
}