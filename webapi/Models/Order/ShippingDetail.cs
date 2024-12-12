namespace AppleApi.Models.Order
{
    public class ShippingDetail
    {
        public string? createdBy { get; set; }
        public string note { get; set; } = null!;
        public DateTime dateCreated { get; set; }
        public string? assignedTo { get; set; }
    }
}
