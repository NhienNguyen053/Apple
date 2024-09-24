namespace webapi.Models.Product
{
    public class OrderProduct
    {
        public string productId { get; set; } = null!;
        public string? color { get; set; }
        public string? memory { get; set; }
        public string? storage { get; set; }
        public int quantity { get; set; }
        public string productName { get; set; } = null!;
        public string productPrice { get; set; } = null!;
        public string? productImage { get; set; } = null!;
    }
}
