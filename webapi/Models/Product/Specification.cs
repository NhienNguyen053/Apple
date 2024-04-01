using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace AppleApi.Models.Product
{
    public class Specification
    {
        public string Display { get; set; } = null!;
        public string Material { get; set; } = null!;
        public string Chip { get; set; } = null!;
        public string Camera { get; set; } = null!;
        public string Functionality { get; set; } = null!;
        public string SizeAndWeight { get; set; } = null!;
        public string PowerAndBattery { get; set; } = null!;
        public string Connector { get; set; } = null!;
    }
}