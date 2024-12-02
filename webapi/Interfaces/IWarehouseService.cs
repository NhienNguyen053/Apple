using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppleApi.Common;
using AppleApi.Models.Warehouse;

namespace AppleApi.Interfaces
{
    public interface IWarehouseService : ICommonRepository<Warehouse>
    {
    }
}
