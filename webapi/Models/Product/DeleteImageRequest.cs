namespace webapi.Models.Product
{
    public class DeleteImageRequest
    {
        public string productId { get; set; } = null!;
        public string color { get; set; } = null!;
        public string imageUrl { get; set; } = null!;
    }
}
