﻿using AppleApi.Enum;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Stripe.Checkout;
using AppleApi.Models.ShoppingCart;
using AppleApi.Models.Product;

namespace AppleApi.Models.Order
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;

        public string OrderId { get; set; } = null!;
        public string? RequestId { get; set; }
        public string? TransId { get; set; }

        public decimal AmountTotal { get; set; }

        public DateTime DateCreated { get; set; }

        public string Currency { get; set; } = null!;


        [BsonRepresentation(BsonType.ObjectId)]
        public string? CustomerId { get; set; }

        public CustomerDetails CustomerDetails { get; set; } = null!;

        public List<OrderProduct> ProductDetails { get; set; } = null!;

        public List<ShippingDetail> ShippingDetails { get; set; } = null!;

        public string Status { get; set; } = null!;
        public int? PaymentStatus { get; set; }
        public string? WarehouseId { get; set; }
    }
}