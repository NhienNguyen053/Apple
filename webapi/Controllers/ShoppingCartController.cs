using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Category;
using AppleApi.Models.Product;
using AppleApi.Services;
using AppleApi.Models.ShoppingCart;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class ShoppingCartController : ControllerBase
{
    private readonly IShoppingCartService shoppingCartService;

    public ShoppingCartController(IShoppingCartService shoppingCartService)
    {
        this.shoppingCartService = shoppingCartService;
    }

    [HttpGet("get-cart-count")]
    public async Task<IActionResult> GetCartCount(string userId)
    {
        List<ShoppingCart> carts = await shoppingCartService.FindManyByFieldAsync("UserId", userId);
        if (carts != null)
        {
            int count = 0;
            foreach (var item in carts)
            {
                count += item.Quantity;
            }
            return Ok(count);
        }
        return NoContent();
    }

    [HttpGet("get-cart")]
    public async Task<IActionResult> GetCart(string userId)
    {
        List<ShoppingCart> carts = await shoppingCartService.FindManyByFieldAsync("UserId", userId);
        if (carts != null)
        {
            return Ok(carts);
        }
        return NoContent();
    }

    [HttpPost("add-to-cart")]
    public async Task<IActionResult> AddToCart([FromBody] ShoppingCart shoppingCart)
    {
        ShoppingCart cart = await shoppingCartService.FindCartByFilter(shoppingCart.UserId, shoppingCart.Id, shoppingCart.Color, shoppingCart.Memory, shoppingCart.Storage);
        if (cart == null)
        {
            ShoppingCart newCart = new()
            {
                Name = shoppingCart.Name,
                Image = shoppingCart.Image,
                Price = shoppingCart.Price,
                Color = shoppingCart.Color,
                Memory = shoppingCart.Memory,
                Storage = shoppingCart.Storage,
                Quantity = shoppingCart.Quantity,
                UserId = shoppingCart.UserId,
                ProductId = shoppingCart.ProductId
            };
            await shoppingCartService.InsertOneAsync(newCart);
            return Ok();
        }
        else
        {
            cart.Quantity = shoppingCart.Quantity + 1;
            await shoppingCartService.UpdateOneAsync(cart.Id, cart);
            return BadRequest("Cart already exist!");
        }
    }

    /*[HttpPost("change-cart")]
    public async Task<IActionResult> ChangeCart([FromBody] ChangeCart changeCart)
    {
        return Ok();
    }

    [HttpPost("remove-from-cart")]
    public async Task<IActionResult> RemoveFromCart([FromBody] RemoveCart removeCart)
    {
        return Ok();
    }*/
}