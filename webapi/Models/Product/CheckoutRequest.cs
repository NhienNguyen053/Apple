using AppleApi.Models.ShoppingCart;
using AppleApi.Models.Order;

namespace AppleApi.Models.Product
{
    public class CheckoutRequest
    {
        public string? UserId { get; set; }
        public List<RequestAnonymousShoppingCart>? Products { get; set; }
        public CustomerDetails CustomerDetails { get; set; } = null!;
    }
}
