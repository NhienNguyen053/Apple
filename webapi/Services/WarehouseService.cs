using AppleApi.Common;
using AppleApi.Interfaces;
using AppleApi.Models;
using AppleApi.Models.Warehouse;
using Microsoft.Extensions.Options;

namespace AppleApi.Services
{
    internal class WarehouseService : CommonRepository<Warehouse>, IWarehouseService
    {
        public WarehouseService(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "Warehouse")
        {
        }
    }
}
