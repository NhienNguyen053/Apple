namespace AppleApi.Models.Order
{
    public class ShippingOrder
    {
        public string Id { get; set; } = null!;
        public string DispatcherId { get; set; } = null!;
        public string DispatchedToId { get; set; } = null!;
        public string PickupAddress { get; set; } = null!;
        public string Note { get; set; } = null!;
        public DateTime DateCreated { get; set; }
        public string Status { get; set; } = null!;
    }
}
