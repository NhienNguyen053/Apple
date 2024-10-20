namespace AppleApi.Models.Order
{
    public class ShippingDetail
    {
        public string? DispatcherId { get; set; }
        public string? DispatchedToId { get; set; }
        public string? PickupAddress { get; set; }
        public string Note { get; set; } = null!;
        public DateTime dateCreated { get; set; }
    }
}
