using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Category;
using AppleApi.Models.Product;
using AppleApi.Models.Warehouse;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class WarehouseController : ControllerBase
{
    private readonly IWarehouseService warehouseService;
    public WarehouseController(IWarehouseService warehouseService)
    {
        this.warehouseService = warehouseService;
    }

    [Authorize(Roles = "User Manager")]
    [HttpGet]
    public async Task<ActionResult> GetWarehouses()
    {
        List<Warehouse> warehouses = await warehouseService.GetAll();
        if (warehouses != null)
        {
            return Ok(warehouses);
        }
        return NoContent();
    }
}