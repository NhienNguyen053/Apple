namespace AppleApi.Models.Momo
{
    public class MomoIPN
    {
        public string PartnerCode { get; set; } = null!;
        public string OrderId { get; set; } = null!;
        public string RequestId { get; set; } = null!;
        public decimal Amount { get; set; }
        public string TransId { get; set; } = null!;
        public string OrderInfo { get; set; } = null!;
        public string OrderGroupId { get; set; } = null!;
        public string ResultCode { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Signature { get; set; } = null!;
        public string? UserId { get; set; }
    }

}
