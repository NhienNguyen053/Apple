using AppleApi.Common;
using AppleApi.Models.Category;
using AppleApi.Models.Order;
using AppleApi.Models.Product;

namespace AppleApi.Interfaces
{
    public interface IOrderService : ICommonRepository<Order>
    {
        Task<Order> DoProductHasOrder(string id);
        Task ScanAndCancelOrders();
        Task ScanAndConfirmOrders();
    }
}
