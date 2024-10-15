namespace AppleApi.Models.ShoppingCart
{
    public class RequestAnonymousShoppingCart
    {
        public string productId { get; set; } = null!;
        public string? productName { get; set; }
        public string? color { get; set; }
        public string? memory { get; set; }
        public string? storage { get; set; }
        public int quantity { get; set; }
        public string? image { get; set; }
    }
}
