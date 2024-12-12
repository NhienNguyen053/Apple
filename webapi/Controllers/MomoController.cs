using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Category;
using System.Text;
using Newtonsoft.Json;
using System.Security.Cryptography;
using AppleApi.Model.Momo;
using AppleApi.Models.Product;
using AppleApi.Models.ShoppingCart;
using AppleApi.Models.Momo;
using Newtonsoft.Json.Linq;
using AppleApi.Models.Order;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using Stripe.Checkout;
using AppleApi.Models.Momo;
using AppleApi.Models.Warehouse;
using AppleApi.Models.User;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class MomoController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IShoppingCartService shoppingCartService;
    private readonly IProductService productService;
    private readonly IOrderService orderService;
    private readonly IWarehouseService warehouseService;
    private readonly IUserService userService;
    readonly Dictionary<string, int> memoryPrices = new()
    {
        {"4GB", 1242250},
        {"8GB", 2484500},
        {"16GB", 3726750},
        {"32GB", 4969000},
        {"64GB", 6211250}
    };

     readonly Dictionary<string, int> storagePrices = new()
     {
        {"64GB", 1242250},
        {"128GB", 2484500},
        {"256GB", 3726750},
        {"512GB", 4969000},
        {"1TB", 6211250},
        {"2TB", 7453500}
    };

    public MomoController(IConfiguration configuration, IUserService userService, IShoppingCartService shoppingCartService, IProductService productService, IOrderService orderService, IWarehouseService warehouseService)
    {
        _configuration = configuration;
        this.shoppingCartService = shoppingCartService;
        this.productService = productService;
        this.orderService = orderService;
        this.warehouseService = warehouseService;
        this.userService = userService;
    }

    [HttpPost]
    public async Task<ActionResult> CreateMomoPayment([FromBody] CheckoutRequest checkoutRequest)
    {
        Guid myuuid = Guid.NewGuid();
        string myuuidAsString = myuuid.ToString();
        string accessKey = "F8BBA842ECF85";
        string secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        string thisReactUrl = _configuration["BaseURL:MainPage"]!;
        string thisApiUrl = _configuration["BaseURL:AdminPage"]!;
        List<Product> products = new();
        List<OrderProduct> cartData = new List<OrderProduct>();
        decimal total = 0;

        if (!string.IsNullOrEmpty(checkoutRequest.UserId))
        {
            List<ShoppingCart> carts = await shoppingCartService.FindManyByFieldAsync("UserId", checkoutRequest.UserId);
            foreach (var cart in carts)
            {
                Product product = await productService.FindByIdAsync(cart.ProductId);
                int selectedMemoryPrice = cart.Memory != null ? memoryPrices.ContainsKey(cart.Memory) ? memoryPrices[cart.Memory] : 0 : 0;
                int selectedStoragePrice = cart.Storage != null ? storagePrices.ContainsKey(cart.Storage) ? storagePrices[cart.Storage] : 0 : 0;
                product.ProductPrice = (decimal.Parse(product.ProductPrice) + selectedMemoryPrice + selectedStoragePrice).ToString();
                if (cart.ProductId != product.Id) continue;
                product.ProductName = product.ProductName + (cart.Color != null ? " - " + cart.Color : "") + (cart.Memory != null ? " - " + cart.Memory + " Memory" : "") + (cart.Storage != null ? " - " + cart.Storage + " Storage" : "");
                product.Colors = new List<string>();
                if (cart.Color != null)
                {
                    product.Colors.Add(cart.Color);
                }
                product.Options.Memory = new List<string>();
                if (cart.Memory != null)
                {
                    product.Options.Memory.Add(cart.Memory);
                }
                product.Options.Storage = new List<string>();
                if (cart.Storage != null)
                {
                    product.Options.Storage.Add(cart.Storage);
                }
                product.ProductStatus = cart.Quantity.ToString();
                product.ProductDescription = product.ProductImages.Where(x => x.Color == cart.Color).FirstOrDefault()?.ImageURLs?.FirstOrDefault() ?? null;
                products.Add(product);
            }

        }
        else if (checkoutRequest.Products != null && checkoutRequest.Products.Any())
        {
            foreach (var item in checkoutRequest.Products)
            {
                Product product = await productService.FindByIdAsync(item.productId);
                int selectedMemoryPrice = item.memory != null ? memoryPrices.ContainsKey(item.memory) ? memoryPrices[item.memory] : 0 : 0;
                int selectedStoragePrice = item.storage != null ? storagePrices.ContainsKey(item.storage) ? storagePrices[item.storage] : 0 : 0;
                product.ProductPrice = (decimal.Parse(product.ProductPrice) + selectedMemoryPrice + selectedStoragePrice).ToString();
                product.ProductName = product.ProductName + (item.color != null ? " - " + item.color : "") + (item.memory != null ? " - " + item.memory + " Memory" : "") + (item.storage != null ? " - " + item.storage + " Storage" : "");
                product.Colors = new List<string>();
                if (item.color != null)
                {
                    product.Colors.Add(item.color);
                }
                product.Options.Memory = new List<string>();
                if (item.memory != null)
                {
                    product.Options.Memory.Add(item.memory);
                }
                product.Options.Storage = new List<string>();
                if (item.storage != null)
                {
                    product.Options.Storage.Add(item.storage);
                }
                product.ProductStatus = item.quantity.ToString();
                product.ProductDescription = product.ProductImages.Where(x => x.Color == item.color).FirstOrDefault()?.ImageURLs?.FirstOrDefault() ?? null;
                products.Add(product);
            }
        }
        else
        {
            return StatusCode(500);
        }
        foreach (var product in products)
        {
            decimal unitPrice = decimal.Parse(product.ProductPrice) * int.Parse(product.ProductStatus);
            total = total + unitPrice;
            OrderProduct data = new()
            {
                productId = product.Id,
                color = !product.Colors.Any() ? "" : product.Colors[0],
                memory = !product.Options.Memory.Any() ? "" : product.Options.Memory[0],
                storage = !product.Options.Storage.Any() ? "" : product.Options.Storage[0],
                quantity = int.Parse(product.ProductStatus),
                productImage = product.ProductDescription,
                productName = product.ProductName,
                productPrice = product.ProductPrice
            };
            cartData.Add(data);
        }

        ShippingDetail shippingDetail = new()
        {
            note = "Order Placed",
            dateCreated = DateTime.Now
        };
        Order newOrder = new()
        {
            OrderId = myuuidAsString,
            AmountTotal = total,
            DateCreated = DateTime.Now,
            Currency = "VND",
            CustomerId = checkoutRequest.UserId,
            CustomerDetails = checkoutRequest.CustomerDetails,
            ShippingDetails = new List<ShippingDetail> { shippingDetail },
            ProductDetails = cartData,
            Status = "Placed",
        };
        await orderService.InsertOneAsync(newOrder);

        CollectionLinkRequest request = new()
        {
            orderInfo = "pay with MoMo",
            partnerCode = "MOMO",
            ipnUrl = "https://localhost:7061/api/Momo/redirectMomo",
            redirectUrl = $"{thisReactUrl}result?orderId={myuuidAsString}",
            amount = (long)Math.Floor(total),
            orderId = myuuidAsString,
            requestId = myuuidAsString,
            requestType = "payWithMethod",
            extraData = checkoutRequest.UserId == null ? "" : checkoutRequest.UserId,
            partnerName = "MoMo Payment",
            storeId = "Test Store",
            orderGroupId = "",
            autoCapture = true,
            lang = "vi",
        };
        var rawSignature = "accessKey=" + accessKey + "&amount=" + request.amount + "&extraData=" + request.extraData + "&ipnUrl=" + request.ipnUrl + "&orderId=" + request.orderId + "&orderInfo=" + request.orderInfo + "&partnerCode=" + request.partnerCode + "&redirectUrl=" + request.redirectUrl + "&requestId=" + request.requestId + "&requestType=" + request.requestType;
        request.signature = getSignature(rawSignature, secretKey);
        StringContent httpContent = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
        var client = new HttpClient();
        var quickPayResponse = await client.PostAsync("https://test-payment.momo.vn/v2/gateway/api/create", httpContent);
        if (!quickPayResponse.IsSuccessStatusCode)
        {
            var errorContent = await quickPayResponse.Content.ReadAsStringAsync();
            return StatusCode(500);
        }
        else
        {
            var contents = await quickPayResponse.Content.ReadAsStringAsync();
            return Ok(contents);
        }
    }

    // currently have to call from frontend cause ipn url can't be localhost and you have to be a partner
    [HttpPost("redirectMomo")]
    public async Task<IActionResult> RedirectMomo([FromBody] MomoIPN momoIPN)
    {
        if (int.Parse(momoIPN.resultCode) == 0)
        {
            if (momoIPN.extraData != "")
            {
                await shoppingCartService.DeleteByFieldAsync("UserId", momoIPN.extraData);
            }
            Order order = await orderService.FindByFieldAsync("OrderId", momoIPN.orderId);
            if (order != null)
            {
                // was planning to use google geolocation api to calculate the order distance to the nearest warehouse but couldn't get through google billing
                Warehouse warehouse = await warehouseService.FindByFieldAsync("Name", "Warehouse North");
                User? user = await userService.UserWithLeastWorkCount("Order Processor", warehouse.Id);
                if (user != null)
                {
                    user.WorkCount = user.WorkCount + 1;
                    await userService.UpdateOneAsync(user.Id, user);
                }
                SendEmail(order.CustomerDetails, order.OrderId, order.DateCreated, order.AmountTotal);
                order.Status = "Paid";
                order.TransId = momoIPN.transId;
                order.RequestId = momoIPN.requestId;
                order.PaymentStatus = int.Parse(momoIPN.resultCode);
                ShippingDetail shippingDetail = new()
                {
                    note = "Order Paid",
                    dateCreated = DateTime.Now,
                    assignedTo = user?.Id
                };
                order.ShippingDetails.Add(shippingDetail);
                order.WarehouseId = warehouse.Id;
                await orderService.UpdateOneAsync(order.Id, order);
                return Ok();
            }
            return BadRequest();
        }
        else
        {
            Order order = await orderService.FindByFieldAsync("OrderId", momoIPN.orderId);
            if (order != null)
            {
                order.Status = "Failed";
                order.PaymentStatus = int.Parse(momoIPN.resultCode);
                ShippingDetail shippingDetail = new()
                {
                    note = "Order Failed",
                    dateCreated = DateTime.Now
                };
                order.ShippingDetails.Add(shippingDetail);
                await orderService.UpdateOneAsync(order.Id, order);
                return Ok();
            }
            return BadRequest();
        }
    }

    [HttpPost("cancelPayment")]
    public async Task<IActionResult> CancelPayment([FromBody] Order newOrder)
    {
        if (newOrder != null)
        {
            Guid myuuid = Guid.NewGuid();
            string myuuidAsString = myuuid.ToString();
            string accessKey = "F8BBA842ECF85";
            string secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            Order order = await orderService.FindByFieldAsync("OrderId", newOrder.OrderId);
            if (order != null && order.Status == "Paid")
            {
                RefundRequest request = new()
                {
                    partnerCode = "MOMO",
                    orderId = myuuidAsString,
                    requestId = myuuidAsString,
                    amount = (long)order.AmountTotal,
                    transId = order.TransId!,
                    lang = "vi",
                    description = ""
                };
                var rawSignature = "accessKey=" + accessKey + "&amount=" + request.amount + "&description=" + request.description + "&orderId=" + request.orderId + "&partnerCode=" + request.partnerCode + "&requestId=" + request.requestId + "&transId=" + request.transId;
                request.signature = getSignature(rawSignature, secretKey);
                StringContent httpContent = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                var client = new HttpClient();
                var quickPayResponse = await client.PostAsync("https://test-payment.momo.vn/v2/gateway/api/refund", httpContent);
                if (!quickPayResponse.IsSuccessStatusCode)
                {
                    var errorContent = await quickPayResponse.Content.ReadAsStringAsync();
                    return StatusCode(500);
                }
                else
                {
                    var contents = await quickPayResponse.Content.ReadAsStringAsync();
                    HashSet<string> uniqueUserIds = new HashSet<string>(order.ShippingDetails.SelectMany(s => new[] { s.createdBy, s.assignedTo }).Where(id => id != null).Cast<string>());
                    foreach (string userId in uniqueUserIds)
                    {
                        User? user = await userService.FindByIdAsync(userId);
                        if (user != null)
                        {
                            user.WorkCount -= 1;
                            await userService.UpdateOneAsync(user.Id, user);
                        }
                    }
                    order.ShippingDetails = newOrder.ShippingDetails;
                    order.Status = "Refunded";
                    await orderService.UpdateOneAsync(order.Id, order);
                    SendRefundEmail(order.CustomerDetails, order.OrderId, order.DateCreated, order.AmountTotal);
                    return Ok(contents);
                }
            }
            return NoContent();
        }
        return BadRequest();
    }

    private static String getSignature(String text, String key)
    {
        ASCIIEncoding encoding = new ASCIIEncoding();
        Byte[] textBytes = encoding.GetBytes(text);
        Byte[] keyBytes = encoding.GetBytes(key);
        Byte[] hashBytes;
        using (HMACSHA256 hash = new HMACSHA256(keyBytes))
        {
            hashBytes = hash.ComputeHash(textBytes);
        }
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }

    private void SendEmail(CustomerDetails customer, string orderId, DateTime dateCreated, decimal amountTotal)
    {
        string senderEmail = "nhiennguyen3999@gmail.com";
        string senderPassword = "gadj yvyj dhlg ixpj";
        string recipientEmail = customer.Email;
        string amountFormatted = amountTotal.ToString("#,0");
        var body = $@"
        <p>Dear {customer.FirstName} {customer.LastName},</p>
        <p>Thank you for your recent order from <strong>Apple</strong>! We are here to confirm that your order has been successfully placed and is being processed.</p>
        
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {orderId}<br>
        <strong>Order Date:</strong> {dateCreated}<br>
        <strong>Total Amount:</strong> {amountFormatted} VND</p>
        <strong>Shipping Address:</strong> {customer.Address}</p>
        
        <p>Click the link below to view your order details:</p><a href=""{_configuration["BaseURL:MainPage"] + "order?id=" + orderId}"" target=""_blank"">View Order Details</a>
        
        <p>Thank you for shopping with us!</p>";
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(senderEmail));
        email.To.Add(MailboxAddress.Parse(recipientEmail));
        email.Subject = "Apple Order Details - Thank You for Your Purchase!";
        email.Body = new TextPart(TextFormat.Html) { Text = body };
        using (var smtp = new SmtpClient())
        {
            smtp.Connect("smtp.gmail.com", 587, false);
            smtp.Authenticate(senderEmail, senderPassword);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }

    private void SendRefundEmail(CustomerDetails customer, string orderId, DateTime dateCreated, decimal amountTotal)
    {
        string senderEmail = "nhiennguyen3999@gmail.com";
        string senderPassword = "gadj yvyj dhlg ixpj";
        string recipientEmail = customer.Email;
        string amountFormatted = amountTotal.ToString("#,0");
        var body = $@"
        <p>Dear {customer.FirstName} {customer.LastName},</p>
        <p>Your order from <strong>Apple</strong> has been refunded!</p>
        
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {orderId}<br>
        <strong>Order Date:</strong> {dateCreated}<br>
        <strong>Total Amount:</strong> {amountFormatted} VND</p>
        <strong>Amount Refunded:</strong> {amountFormatted} VND</p>
        
        <p>Click the link below to view your order details:</p><a href=""{_configuration["BaseURL:MainPage"] + "order?id=" + orderId}"" target=""_blank"">View Order Details</a>
        
        <p>Thank you for shopping with us!</p>";
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(senderEmail));
        email.To.Add(MailboxAddress.Parse(recipientEmail));
        email.Subject = "Apple Order Details - Thank You for Your Purchase!";
        email.Body = new TextPart(TextFormat.Html) { Text = body };
        using (var smtp = new SmtpClient())
        {
            smtp.Connect("smtp.gmail.com", 587, false);
            smtp.Authenticate(senderEmail, senderPassword);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}