namespace webapi.Models
{
    public class ProductImage
    {
        public string? Color { get; set; }
        public List<string> ImageURLs { get; set; } = null!;
    }
}
