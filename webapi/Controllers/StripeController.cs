using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Microsoft.AspNetCore.Hosting.Server.Features;
using webapi.Models.Stripe;
using Microsoft.AspNetCore.Hosting.Server;
using AppleApi.Models.Category;
using AppleApi.Interfaces;
using AppleApi.Models.Product;
using AppleApi.Models.ShoppingCart;

[Route("api/[controller]")]
[ApiController]
[ApiExplorerSettings(IgnoreApi = false)]
public class StripeController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IShoppingCartService shoppingCartService;
    private readonly IProductService productService;

    public StripeController(IConfiguration configuration, IShoppingCartService shoppingCartService, IProductService productService)
    {
        _configuration = configuration;
        this.shoppingCartService = shoppingCartService;
        this.productService = productService;
    }

    [HttpPost]
    public async Task<ActionResult> CheckoutOrder([FromBody] CheckoutRequest request)
    {
        string? thisApiUrl = _configuration["BaseURL:BackEnd"];
        string? thisReactUrl = _configuration["BaseURL:FrontEnd"]; 

        if (thisApiUrl is not null)
        {
            List<Product> products = new();
            if (!string.IsNullOrEmpty(request.UserId))
            {
                List<ShoppingCart> carts = await shoppingCartService.FindManyByFieldAsync("UserId", request.UserId);
                List<string> ids = new();
                foreach (var cart in carts)
                {
                    ids.Add(cart.ProductId);
                }
                products = await productService.FindManyByListId(ids);
                foreach (var product in products)
                {
                    List<ProductImage> newProductImages = new List<ProductImage>();
                    foreach (var cart in carts)
                    {
                        if (cart.ProductId != product.Id) continue;
                        product.ProductName = product.ProductName + (cart.Color != null ? " - " + cart.Color : "") + (cart.Memory != null ? " - " + cart.Memory + " Memory" : "") + (cart.Storage != null ? " - " + cart.Storage + " Storage" : "");

                        product.ProductQuantity = cart.Quantity.ToString();
                        ProductImage image = new();
                        if (product.Colors != null && product.Colors.Any())
                        {
                            if (thisReactUrl != null)
                            {
                                if (product.ProductImages != null && product.ProductImages.Any())
                                {
                                    var matchingImage = product.ProductImages.FirstOrDefault(x => x.Color == cart.Color);
                                    if (matchingImage != null)
                                    {
                                        image = matchingImage;
                                    }
                                    else
                                    {
                                        image.ImageURLs.Add(thisReactUrl + "no-image.jpeg");
                                    }
                                }
                                else
                                {
                                    image.ImageURLs.Add(thisReactUrl + "no-image.jpeg");
                                }
                            }
                        }
                        newProductImages.Add(image);
                    }
                    product.ProductImages = newProductImages;
                }

            }
            else if (request.Products != null && request.Products.Any())
            {
                List<string> ids = new();
                foreach (var item in request.Products)
                {
                    ids.Add(item.productId);
                }
                products = await productService.FindManyByListId(ids);
                foreach (var product in products)
                {
                    List<ProductImage> newProductImages = new List<ProductImage>();
                    foreach (var item in request.Products)
                    {
                        if (item.productId != product.Id) continue;
                        product.ProductName = product.ProductName + (item.color != null ? " - " + item.color : "") + (item.memory != null ? " - " + item.memory + " Memory" : "") + (item.storage != null ? " - " + item.storage + " Storage" : "");
                        product.ProductQuantity = item.quantity.ToString();
                        ProductImage image = new();
                        if (product.Colors != null && product.Colors.Any())
                        {
                            if (thisReactUrl != null)
                            {
                                if (product.ProductImages != null && product.ProductImages.Any())
                                {
                                    var matchingImage = product.ProductImages.FirstOrDefault(x => x.Color == item.color);
                                    if (matchingImage != null)
                                    {
                                        image = matchingImage;
                                    }
                                    else
                                    {
                                        image.ImageURLs.Add(thisReactUrl + "no-image.jpeg");
                                    }
                                }
                                else
                                {
                                    image.ImageURLs.Add(thisReactUrl + "no-image.jpeg");
                                }
                            }
                        }
                        newProductImages.Add(image);
                    }
                    product.ProductImages = newProductImages;
                }
            }
            else
            {
                return StatusCode(500);
            }
            var sessionId = await CheckOut(products, thisApiUrl);
            var pubKey = _configuration["Stripe:PubKey"];

            var checkoutOrderResponse = new CheckoutOrderResponse()
            {
                SessionId = sessionId,
                PubKey = pubKey
            };

            return Ok(checkoutOrderResponse);
        }
        else
        {
            return StatusCode(500);
        }
    }

    [NonAction]
    public async Task<string> CheckOut(List<Product> products, string thisApiUrl)
    {
        var lineItems = new List<SessionLineItemOptions>();

        foreach (var product in products)
        {
            decimal unitPrice = decimal.Parse(product.ProductPrice);
            long quantity = long.Parse(product.ProductQuantity);
            long totalAmountCents = (long)(unitPrice * quantity * 100);
            var lineItem = new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = totalAmountCents,
                    Currency = "USD",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = product.ProductName,
                        Images = new List<string> { product.ProductImages[0].ImageURLs[0] }
                    },
                },
                Quantity = quantity,
            };

            lineItems.Add(lineItem);
        }

        var options = new SessionCreateOptions
        {
            SuccessUrl = $"{thisApiUrl}/checkout/success?sessionId=" + "{CHECKOUT_SESSION_ID}",
            CancelUrl = _configuration["BaseURL:FrontEnd"] + "failed",
            PaymentMethodTypes = new List<string>
        {
            "card"
        },
            LineItems = lineItems,
            Mode = "payment"
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return session.Id;
    }


    [HttpGet("success")]
    public ActionResult CheckoutSuccess(string sessionId)
    {
        var sessionService = new SessionService();
        var session = sessionService.Get(sessionId);

        var total = session.AmountTotal.Value;
        var customerEmail = session.CustomerDetails.Email;

        return Redirect(_configuration["BaseURL:FrontEnd"] + "success");
    }
}
