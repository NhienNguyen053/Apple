using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Order;
using AppleApi.Models.Product;
using webapi.Models.Product;
using AppleApi.Models.User;

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

    [Authorize(Roles = "User Manager, Product Manager, Order Processor")]
    [HttpGet("getAllOrders")]
    public async Task<IActionResult> GetAllOrders()
    {
        List<Order> orders = await orderService.GetAll();
        return Ok(orders);
    }

    [Authorize]
    [HttpGet("getUserOrders")]
    public async Task<IActionResult> GetUserOrders(string userId)
    {
        List<Order> orders = await orderService.FindManyByFieldAsync("CustomerId", userId);
        if (orders != null)
        {
            return Ok(orders);
        }
        return NoContent();
    }

    [Authorize(Roles = "Dispatcher, Shipper")]
    [HttpGet("getAndroidOrders")]
    public async Task<IActionResult> GetAndroidOrders(string userId)
    {
        User user = await userService.FindByIdAsync(userId);
        if (user != null)
        {
            if (user.Role == "Dispatcher")
            {
                List<Order> orders = await orderService.GetDispatcherOrders();
                if (orders != null)
                {
                    return Ok(orders);
                } else
                {
                    return NoContent();
                }
            } else
            {
                List<Order> orders = await orderService.GetShipperOrders(userId);
                if (orders != null)
                {
                    return Ok(orders);
                }
                else
                {
                    return NoContent();
                }
            }
        }
        return NoContent();
    }

    [Authorize(Roles = "Dispatcher")]
    [HttpPost("dispatchOrder")]
    public async Task DispatchOrder([FromBody] DispatchOrder detail)
    {
        Order order = await orderService.FindByIdAsync(detail.Id);
        if (order != null)
        {
            ShippingDetail shippingDetail = new()
            {
                DispatcherId = detail.DispatcherId,
                DispatchedToId = detail.DispatchedToId,
                PickupAddress = detail.PickupAddress,
                Note = detail.Note,
                dateCreated = detail.DateCreated
            };
            order.ShippingDetails.Add(shippingDetail);
            await orderService.UpdateOneAsync(detail.Id, order);
        }
    }

    [Authorize(Roles = "Shipper")]
    [HttpPost("shippingOrder")]
    public async Task ShippingOrder([FromBody] ShippingOrder detail)
    {
        Order order = await orderService.FindByIdAsync(detail.Id);
        if (order != null)
        {
            ShippingDetail shippingDetail = new()
            {
                DispatcherId = detail.DispatcherId,
                DispatchedToId = detail.DispatchedToId,
                PickupAddress = detail.PickupAddress,
                Note = detail.Note,
                dateCreated = detail.DateCreated
            };
            order.ShippingDetails.Add(shippingDetail);
            order.Status = detail.Status;
            await orderService.UpdateOneAsync(detail.Id, order);
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
                ProductDetails = new List<OrderProduct>(),
                ShippingDetails = order.ShippingDetails,
                Status = order.Status,
            };
            foreach (var item in order.ProductDetails)
            {
                Product product = await productService.FindByIdAsync(item.productId);
                OrderProduct orderProduct = new()
                {
                    productId = item.productId,
                    color = item.color,
                    storage = item.storage,
                    memory = item.memory,
                    quantity = item.quantity,
                    productName = product.ProductName,
                    productPrice = product.ProductPrice,
                    productImage = product.ProductImages.FirstOrDefault(x => x.Color == item.color)?.ImageURLs?.FirstOrDefault()
                };
                details.ProductDetails.Add(orderProduct);
            }
            return Ok(details);
        }
        return BadRequest();
    }

    [Authorize(Roles = "Order Processor")]
    [HttpPost("updateOrder")]
    public async Task UpdateOrder([FromBody] Order newOrder)
    {
        Order order = await orderService.FindByFieldAsync("OrderId", newOrder.OrderId);
        if (order != null) {
            order.CustomerDetails = newOrder.CustomerDetails;
            order.ShippingDetails = newOrder.ShippingDetails;
            order.Status = newOrder.Status;
            await orderService.UpdateOneAsync(order.Id, order);
        }
    }

    [Authorize(Roles = "Order Processor")]
    [HttpPost("cancelOrder")]
    public async Task CancelOrder([FromBody] Order newOrder)
    {
        Order order = await orderService.FindByFieldAsync("OrderId", newOrder.OrderId);
        if (order != null)
        {
            order.ShippingDetails = newOrder.ShippingDetails;
            order.Status = newOrder.Status;
            await orderService.UpdateOneAsync(order.Id, order);
        }
    }
}