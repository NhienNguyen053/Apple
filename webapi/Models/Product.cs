using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using webapi.Models;


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
        public string SubCategoryId { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public List<string> Colors { get; set; } = null!;
        public Specification Specifications { get; set; } = null!;
        public Option Options { get; set; } = null!;
        public List<ProductImage> ProductImages { get; set; } = null!;
    }
}