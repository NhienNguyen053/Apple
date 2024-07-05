using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using Microsoft.AspNetCore.Hosting.Server.Features;
using webapi.Models.Stripe;
using webapi.Models.Product;
using Microsoft.AspNetCore.Hosting.Server;

[Route("api/[controller]")]
[ApiController]
[ApiExplorerSettings(IgnoreApi = false)]
public class StripeController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public StripeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<ActionResult> CheckoutOrder([FromBody] CheckoutProduct product)
    {
        string? thisApiUrl = _configuration["BaseURL:BackEnd"];

        if (thisApiUrl is not null)
        {
            var sessionId = await CheckOut(product, thisApiUrl);
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
    public async Task<string> CheckOut(CheckoutProduct product, string thisApiUrl)
    {
        var options = new SessionCreateOptions
        {
            SuccessUrl = $"{thisApiUrl}/checkout/success?sessionId=" + "{CHECKOUT_SESSION_ID}",
            CancelUrl = _configuration["BaseURL:FrontEnd"] + "failed",
            PaymentMethodTypes = new List<string>
            {
                "card"
            },
            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = long.Parse(product.ProductPrice),
                        Currency = "USD",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = product.ProductName,
                            Description = product.ProductDescription,
                            Images = new List<string> { product.ProductName }
                        },
                    },
                    Quantity = 1,
                },
            },
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
