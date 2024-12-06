namespace AppleApi.Models.Momo
{
    public class MomoIPN
    {
        public string orderId { get; set; } = null!;
        public string requestId { get; set; } = null!;
        public decimal amount { get; set; }
        public string transId { get; set; } = null!;
        public string resultCode { get; set; } = null!;
        public string extraData { get; set; } = null!;
    }

}
