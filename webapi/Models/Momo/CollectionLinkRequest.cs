namespace AppleApi.Model.Momo
{
    public class CollectionLinkRequest
    {
        public string orderInfo { get; set; } = null!;
        public string partnerCode { get; set; } = null!;
        public string redirectUrl { get; set; } = null!;
        public string ipnUrl { get; set; } = null!;
        public long amount { get; set; }
        public string orderId { get; set; } = null!;
        public string requestId { get; set; } = null!;
        public string extraData { get; set; } = null!;
        public string partnerName { get; set; } = null!;
        public string storeId { get; set; } = null!;
        public string requestType { get; set; } = null!;
        public string orderGroupId { get; set; } = null!;
        public bool autoCapture { get; set; }
        public string lang { get; set; } = null!;
        public string signature { get; set; } = null!;
    }
}