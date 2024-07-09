using webapi.Models.ShoppingCart;

namespace AppleApi.Models.Product
{
    public class CheckoutRequest
    {
        public string? UserId { get; set; }
        public List<RequestAnonymousShoppingCart>? Products { get; set; }
    }
}
