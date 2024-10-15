using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Category;
using AppleApi.Models.Product;
using AppleApi.Services;
using AppleApi.Models.ShoppingCart;
using MongoDB.Driver;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class ShoppingCartController : ControllerBase
{
    private readonly IShoppingCartService shoppingCartService;
    private readonly IProductService productService;

    public ShoppingCartController(IShoppingCartService shoppingCartService, IProductService productService)
    {
        this.shoppingCartService = shoppingCartService;
        this.productService = productService;
    }

    [Authorize]
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

    [HttpPost("get-cart-anonymous")]
    public async Task<IActionResult> GetCartCountAnonymous([FromBody] List<ShoppingCart> carts)
    {
        List<RequestShoppingCart> requestShoppingCarts = new();
        List<string> productIds = carts.Select(cart => cart.ProductId).ToList();
        FilterDefinition<Product> filter = Builders<Product>.Filter.In(x => x.Id, productIds);
        filter = filter & Builders<Product>.Filter.Eq(p => p.ProductStatus, "Active");
        List<Product> products = await productService.FindManyAsync(filter);
        foreach (ShoppingCart cart in carts)
        {
            var matchingProduct = products.FirstOrDefault(p => p.Id == cart.ProductId);
            if (matchingProduct != null)
            {
                var isColorMatch = cart.Color == null || matchingProduct.Colors.Contains(cart.Color);
                var isMemoryMatch = cart.Memory == null || matchingProduct.Options.Memory.Contains(cart.Memory);
                var isStorageMatch = cart.Storage == null || matchingProduct.Options.Storage.Contains(cart.Storage);
                if (isColorMatch && isMemoryMatch && isStorageMatch)
                {
                    RequestShoppingCart requestShoppingCart = new()
                    {
                        Name = matchingProduct.ProductName,
                        Image = matchingProduct.ProductImages.Find(x => x.Color == cart.Color)?.ImageURLs[0],
                        Price = matchingProduct.ProductPrice,
                        Color = cart.Color,
                        Memory = cart.Memory,
                        Storage = cart.Storage,
                        Quantity = cart.Quantity,
                        Id = matchingProduct.Id,
                    };
                    requestShoppingCarts.Add(requestShoppingCart);
                }
            }
        }
        return Ok(requestShoppingCarts);
    }

    [Authorize]
    [HttpGet("get-cart")]
    public async Task<IActionResult> GetCart(string userId)
    {
        List<RequestShoppingCart> requestShoppingCarts = new();
        List<ShoppingCart> carts = await shoppingCartService.FindManyByFieldAsync("UserId", userId);
        if (carts != null)
        {
            HashSet<string> uniqueIds = new HashSet<string>();

            foreach (var cart in carts)
            {
                uniqueIds.Add(cart.ProductId);
            }

            List<string> ids = uniqueIds.ToList();
            List<Product> products = await productService.FindManyByListId(ids);
            foreach (var cart in carts)
            {
                RequestShoppingCart requestShoppingCart = new()
                {
                    Id = cart.Id,
                    Name = products.FirstOrDefault(x => x.Id == cart.ProductId)?.ProductName,
                    Image = products.FirstOrDefault(x => x.Id == cart.ProductId)?.ProductImages.Find(x => x.Color == cart.Color)?.ImageURLs[0],
                    Price = products.FirstOrDefault(x => x.Id == cart.ProductId)?.ProductPrice,
                    Color = cart.Color,
                    Memory = cart.Memory,
                    Storage = cart.Storage,
                    Quantity = cart.Quantity,
                    UserId = cart.UserId,
                    ProductId = cart.ProductId,
                };
                requestShoppingCarts.Add(requestShoppingCart);
            }
            return Ok(requestShoppingCarts);
        }
        return NoContent();
    }

    [Authorize]
    [HttpPost("add-to-cart")]
    public async Task<IActionResult> AddToCart([FromBody] ShoppingCart shoppingCart)
    {
        ShoppingCart cart = await shoppingCartService.FindCartByFilter(shoppingCart.UserId, shoppingCart.ProductId, shoppingCart.Color, shoppingCart.Memory, shoppingCart.Storage);
        if (cart == null)
        {
            ShoppingCart newCart = new()
            {
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

    [HttpPost("change-cart")]
    public async Task<IActionResult> ChangeCart([FromBody] ChangeCart changeCart)
    {
        var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("bearer ", "");
        if (token == "undefined")
        {
            FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(x => x.Id, changeCart.Id);
            filter = filter & Builders<Product>.Filter.Eq(p => p.ProductStatus, "Active");
            Product product = await productService.FindAsync(filter);
            return Ok(product);
        }
        else
        {
            ShoppingCart cart = await shoppingCartService.FindByIdAsync(changeCart.Id);
            if (cart == null)
            {
                return BadRequest();
            }
            else
            {
                Product product = await productService.FindByIdAsync(cart.ProductId);
                cart.Quantity = changeCart.Quantity;
                await shoppingCartService.UpdateOneAsync(changeCart.Id, cart);
                return Ok(product);
            }
        }
    }

    [Authorize]
    [HttpPost("remove-from-cart")]
    public async Task<IActionResult> RemoveFromCart(string id)
    {
        var result = await shoppingCartService.DeleteOneAsync(id);
        if (result == null)
        {
            return NoContent();
        }
        return Ok();
    }
}