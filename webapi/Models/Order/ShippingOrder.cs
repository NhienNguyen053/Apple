namespace AppleApi.Models.Order
{
    public class ShippingOrder
    {
        public string Id { get; set; } = null!;
        public string CreatedBy { get; set; } = null!;
        public string Note { get; set; } = null!;
        public DateTime DateCreated { get; set; }
        public string Status { get; set; } = null!;
    }
}
