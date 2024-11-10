using AppleApi.Models.Order;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AppleApi.Models.User
{
    public class ShippingData
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? StreetAddress { get; set; }
        public string? Country { get; set; } = "Việt Nam";
        public string? CityProvince { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? EmailAddress { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
