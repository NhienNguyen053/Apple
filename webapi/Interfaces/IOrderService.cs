using AppleApi.Common;
using AppleApi.Models.Category;
using AppleApi.Models.Order;

namespace AppleApi.Interfaces
{
    public interface IOrderService : ICommonRepository<Order>
    {
        Task ScanAndCancelOrders();
    }
}
