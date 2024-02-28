using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace webapi.Models.Category;

public class DashboardCategory
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public string? ImageURL { get; set; }

    public List<Category>? ChildCategories { get; set; }
}