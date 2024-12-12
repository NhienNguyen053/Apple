using AppleApi.Enum;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Stripe.Checkout;
using AppleApi.Models.ShoppingCart;
using AppleApi.Models.Product;

namespace AppleApi.Models.Order;

public class OrderDetails
{
    public string OrderId { get; set; } = null!;

    public decimal AmountTotal { get; set; }

    public DateTime DateCreated { get; set; }

    public CustomerDetails CustomerDetails { get; set; } = null!;

    public List<OrderProduct> ProductDetails { get; set; } = null!;

    public List<ShippingDetail> ShippingDetails { get; set; } = null!;

    public string Status { get; set; } = null!;
}