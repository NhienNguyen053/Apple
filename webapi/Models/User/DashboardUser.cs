using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace webapi.Models.User
{
    public class DashboardUser
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Country { get; set; }
        public DateTime Birthday { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Role { get; set; }
        public DateTime? VerifiedAt { get; set; }
    }
}
