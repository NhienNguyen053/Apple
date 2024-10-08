using AppleApi.Models.Order;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AppleApi.Models.User
{
    public class DashboardData
    {
        public int Products { get; set; }
        public int Users { get; set; }
        public int Orders { get; set; }
        public int CanceledOrders { get; set; }
        public int PaidOrders { get; set; }
        public int ProcessingOrders { get; set; }
        public int ShippingOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public Dictionary<string, int> YearlyOrders { get; set; } = null!;
        public decimal Revenue { get; set; }
    }
}
