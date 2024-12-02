namespace webapi.Models.Momo
{
    public class RefundRequest
    {
        public string partnerCode { get; set; } = null!;
        public string orderId { get; set; } = null!;
        public string requestId { get; set; } = null!;
        public string transId { get; set; } = null!;
        public long amount { get; set; }
        public string lang { get; set; } = null!;
        public string? description { get; set; }
        public string signature { get; set; } = null!;
    }
}
