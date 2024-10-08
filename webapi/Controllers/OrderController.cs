﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Order;
using AppleApi.Models.Product;
using webapi.Models.Product;

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

    [Authorize(Roles = "User Manager, Product Manager, Order Manager")]
    [HttpGet("getAllOrders")]
    public async Task<IActionResult> GetAllOrders()
    {
        List<Order> orders = await orderService.GetAll();
        return Ok(orders);
    }

    [HttpGet("getOrderDetails")]
    public async Task<IActionResult> GetOrderDetails(string id)
    {
        if (String.IsNullOrEmpty(id))
        {
            return BadRequest();
        }
        Order order = await orderService.FindByFieldAsync("OrderId", id);
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

    [Authorize(Roles = "Order Manager")]
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
}