using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AppleApi.Models;

public class BoxItem
{
    public string BoxName { get; set; } = null!;

    public string ImageURL { get; set; } = null!;
}