namespace webapi.Models.Product
{
    public class CheckoutProduct
    {
        public string ProductName { get; set; } = null!;
        public string ProductPrice { get; set; } = null!;
        public string? ProductDescription { get; set; }
        public string? ProductImage { get; set; }
    }
}
