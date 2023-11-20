using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace AppleApi.Models
{
    public class UserReturn
    {
        public DateTime? VerifiedAt { get; set; }
    }
}