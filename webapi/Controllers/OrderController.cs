using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Order;
using AppleApi.Models.Product;
using AppleApi.Models.User;
using MongoDB.Driver;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService orderService;
    private readonly IProductService productService;
    private readonly IUserService userService;

    public OrderController(IOrderService orderService, IProductService productService, IUserService userService)
    {
        this.orderService = orderService;
        this.productService = productService;
        this.userService = userService;
    }

    [Authorize(Roles = "Order Manager, Order Processor, Warehouse Staff, Shipper")]
    [HttpGet("getAllOrders")]
    public async Task<IActionResult> GetAllOrders(string status)
    {
        string? id = User.FindFirst("Id")?.Value;
        if (id != null)
        {
            User user = await userService.FindByIdAsync(id);
            if (user != null && !string.IsNullOrEmpty(user.WarehouseId))
            {
                if (User.IsInRole("Order Manager") && id != null)
                {
                    List<Order> orders = new();
                    if (status == "All")
                    {
                        orders = await orderService.FindManyByFieldAsync("WarehouseId", user.WarehouseId);
                    }
                    else
                    {
                        var filter = Builders<Order>.Filter.Or(
                            Builders<Order>.Filter.Eq(order => order.Status, status),
                            Builders<Order>.Filter.Eq(order => order.WarehouseId, user.WarehouseId)
                        );
                        orders = await orderService.FindManyAsync(filter);
                    }
                    return Ok(orders);
                }
                else if (User.IsInRole("Order Processor") && id != null)
                {
                    var filter = Builders<Order>.Filter.And(
                        Builders<Order>.Filter.ElemMatch(order => order.ShippingDetails, detail => detail.assignedTo == id),
                        Builders<Order>.Filter.Or(
                            Builders<Order>.Filter.Eq(order => order.Status, "Paid"),
                            Builders<Order>.Filter.Eq(order => order.Status, "Processing"),
                            Builders<Order>.Filter.Eq(order => order.Status, "Shipping")
                        )
                    );
                    List<Order> orders = await orderService.FindManyAsync(filter);
                    return Ok(orders);
                }
                else if (User.IsInRole("Warehouse Staff"))
                {
                    var filter = Builders<Order>.Filter.And(
                        Builders<Order>.Filter.ElemMatch(order => order.ShippingDetails, detail => detail.assignedTo == id),
                        Builders<Order>.Filter.Or(
                            Builders<Order>.Filter.Eq(order => order.Status, "Processing"),
                            Builders<Order>.Filter.Eq(order => order.Status, "Shipping")
                        )
                    );
                    List<Order> orders = await orderService.FindManyAsync(filter);
                    return Ok(orders);
                }
                else
                {
                    var filter = Builders<Order>.Filter.And(
                        Builders<Order>.Filter.ElemMatch(order => order.ShippingDetails, detail => detail.assignedTo == id),
                        Builders<Order>.Filter.Eq(order => order.Status, "Shipping")
                    );
                    List<Order> orders = await orderService.FindManyAsync(filter);
                    return Ok(orders);
                }
            }
            else
            {
                return NoContent();
            }
        }
        else
        {
            return NoContent();
        }
    }

    [Authorize]
    [HttpGet("getUserOrders")]
    public async Task<IActionResult> GetUserOrders(string userId, string status)
    {
        FilterDefinition<Order> filter;

        if (status == "All")
        {
            filter = Builders<Order>.Filter.And(
                Builders<Order>.Filter.Ne(order => order.Status, "Placed"),
                Builders<Order>.Filter.Eq(order => order.CustomerId, userId)
            );
        }
        else
        {
            filter = Builders<Order>.Filter.And(
                Builders<Order>.Filter.Eq(order => order.Status, status),
                Builders<Order>.Filter.Eq(order => order.CustomerId, userId)
            );
        }
        List<Order> orders = await orderService.FindManyAsync(filter);
        if (orders != null)
        {
            return Ok(orders);
        }
        return NoContent();
    }

    [Authorize(Roles = "Shipper")]
    [HttpGet("getShipperOrders")]
    public async Task<IActionResult> ShippingOrder(string id)
    { 
        var filter = Builders<Order>.Filter.And(
            Builders<Order>.Filter.ElemMatch(order => order.ShippingDetails, detail => detail.assignedTo == id),
            Builders<Order>.Filter.Or(
                Builders<Order>.Filter.Eq(order => order.Status, "Shipping"),
                Builders<Order>.Filter.Eq(order => order.Status, "Processing")
            )
        );
        List<Order> orders = await orderService.FindManyAsync(filter);
        if (orders != null)
        {
            return Ok(orders);
        }
        return NoContent();
    }

    [HttpPost("confirmOrder")]
    public async Task ConfirmOrder([FromBody] string id)
    {
        Order order = await orderService.FindByFieldAsync("OrderId", id);
        if (order != null)
        {
            order.Status = "Confirmed";
            await orderService.UpdateOneAsync(order.Id, order);
        }
    }

    [HttpGet("getOrderDetails")]
    public async Task<IActionResult> GetOrderDetails(string id)
    {
        if (String.IsNullOrEmpty(id))
        {
            return BadRequest();
        }
        Order order = await orderService.FindByFieldAsync("OrderId", id);
        if (order != null)
        {
            OrderDetails details = new()
            {
                OrderId = order.OrderId,
                AmountTotal = order.AmountTotal,
                DateCreated = order.DateCreated,
                CustomerDetails = order.CustomerDetails,
                ProductDetails = order.ProductDetails,
                ShippingDetails = order.ShippingDetails,
                Status = order.Status,
            };
            return Ok(details);
        }
        return BadRequest();
    }

    [Authorize(Roles = "Order Processor, Shipper, Warehouse Staff")]
    [HttpPost("updateOrder")]
    public async Task UpdateOrder([FromBody] Order newOrder)
    {
        Order order = await orderService.FindByFieldAsync("OrderId", newOrder.OrderId);
        string? id = User.FindFirst("Id")?.Value;
        if (id != null)
        {
            User user = await userService.FindByIdAsync(id);
            if (user != null && order != null && !string.IsNullOrEmpty(user.WarehouseId))
            {
                order.CustomerDetails = newOrder.CustomerDetails;
                order.ShippingDetails = newOrder.ShippingDetails;
                if (User.IsInRole("Order Processor"))
                {
                    User? staff = await userService.UserWithLeastWorkCount("Warehouse Staff", user.WarehouseId);
                    if (staff != null)
                    {
                        order.ShippingDetails.Last().assignedTo = staff.Id;
                        staff.WorkCount = staff.WorkCount + 1;
                        await userService.UpdateOneAsync(staff.Id, staff);
                    }
                }
                else if (User.IsInRole("Warehouse Staff"))
                {
                    User? shipper = await userService.UserWithLeastWorkCount("Shipper", user.WarehouseId);
                    if (shipper != null)
                    {
                        order.ShippingDetails.Last().assignedTo = shipper.Id;
                        shipper.WorkCount = shipper.WorkCount + 1;
                        await userService.UpdateOneAsync(shipper.Id, shipper);
                    }
                }
                else
                {
                    HashSet<string> uniqueUserIds = new HashSet<string>(order.ShippingDetails.SelectMany(s => new[] { s.createdBy, s.assignedTo }).Where(id => id != null).Cast<string>());
                    foreach (string userId in uniqueUserIds)
                    {
                        User? updateUser = await userService.FindByIdAsync(userId);
                        if (updateUser != null)
                        {
                            updateUser.WorkCount -= 1;
                            await userService.UpdateOneAsync(updateUser.Id, updateUser);
                        }
                    }
                }
                order.Status = newOrder.Status;
                await orderService.UpdateOneAsync(order.Id, order);
            }
        }
    }
}