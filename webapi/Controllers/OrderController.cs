using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Order;
using AppleApi.Models.Product;
using webapi.Models.Product;
using AppleApi.Models.User;
using MongoDB.Driver;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService orderService;
    private readonly IProductService productService;

    public OrderController(IOrderService orderService, IProductService productService)
    {
        this.orderService = orderService;
        this.productService = productService;
    }

    [Authorize(Roles = "User Manager, Product Manager, Order Processor")]
    [HttpGet("getAllOrders")]
    public async Task<IActionResult> GetAllOrders()
    {
        if (User.IsInRole("Order Processor"))
        {
            var filter = Builders<Order>.Filter.Or(
                Builders<Order>.Filter.Eq(order => order.Status, "Paid"),
                Builders<Order>.Filter.Eq(order => order.Status, "Processing")
            );
            List <Order> orders = await orderService.FindManyAsync(filter);
            return Ok(orders);
        }
        else
        {
            List<Order> orders = await orderService.GetAll();
            return Ok(orders);
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
        var filter = Builders<Order>.Filter.Or(
            Builders<Order>.Filter.Eq(order => order.Status, "Processing"),
            Builders<Order>.Filter.And(
                Builders<Order>.Filter.Eq(order => order.Status, "Shipping"),
                Builders<Order>.Filter.ElemMatch(order => order.ShippingDetails, detail => detail.createdBy == id)
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
                    productImage = product.Colors.Count == 0 ? product.ProductImages.FirstOrDefault()?.ImageURLs?.FirstOrDefault() : product.ProductImages.FirstOrDefault(x => x.Color == item.color)?.ImageURLs?.FirstOrDefault()
                };
                details.ProductDetails.Add(orderProduct);
            }
            return Ok(details);
        }
        return BadRequest();
    }

    [Authorize(Roles = "Order Processor, Shipper")]
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