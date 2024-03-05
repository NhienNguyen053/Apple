using AppleApi.Interfaces;
using AppleApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using webapi.Models.Product;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService productService;

        public ProductController(IProductService productService)
        {
            this.productService = productService;
        }

        [HttpGet("getAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            List<Product> products = await productService.GetAll();
            return Ok(products);
        }

        [Authorize(Roles = "Admin, Employee")]
        [HttpGet("getProductById")]
        public async Task<IActionResult> GetProductById(string id)
        {
            Product product = await productService.FindByIdAsync(id);
            if (product == null)
            {
                return NoContent();
            }
            return Ok(product);
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("createProduct")]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            Product newProduct = new();
            Product newestProduct = await productService.FindNewest("ProductNumber");
            if(newestProduct != null)
            {
                newProduct.ProductNumber = newestProduct.ProductNumber + 1;
            }
            else
            {
                newProduct.ProductNumber = 10000;
            }
            newProduct.ProductName = product.ProductName;
            newProduct.ProductPrice = product.ProductPrice;
            newProduct.ProductQuantity = product.ProductQuantity;
            newProduct.ProductStatus = product.ProductStatus;
            newProduct.CategoryId = product.CategoryId;
            newProduct.SubCategoryId = product.SubCategoryId;
            newProduct.ProductDescription = product.ProductDescription;
            newProduct.Colors = product.Colors;
            newProduct.Specifications = product.Specifications;
            newProduct.Options = product.Options;
            newProduct.ProductImages = new List<ProductImage>();
            Product newlyAdded = await productService.InsertOneAsync(newProduct);
            return Ok(newlyAdded);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("updateProduct")]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
        {
            List<string> urls = new();
            Product updateProduct = await productService.FindByIdAsync(product.Id);
            if (updateProduct.Colors.Count() == 0 && product.Colors.Count() != 0)
            {
                var productImageWithoutColor = updateProduct.ProductImages.FirstOrDefault(x => x.Color == null);
                if (productImageWithoutColor != null)
                {
                    urls.AddRange(productImageWithoutColor.ImageURLs);
                    updateProduct.ProductImages = new List<ProductImage>();
                }
            }
            else if (updateProduct.Colors.Count() > product.Colors.Count())
            {
                var colorChanges = updateProduct.Colors.Except(product.Colors).ToArray();
                foreach (var color in colorChanges)
                {
                    var productImageToRemove = updateProduct.ProductImages.FirstOrDefault(x => x.Color == color);
                    if (productImageToRemove != null)
                    {
                        urls.AddRange(productImageToRemove.ImageURLs);
                        updateProduct.ProductImages.Remove(productImageToRemove);
                    }
                }
            }
            updateProduct.ProductName = product.ProductName;
            updateProduct.ProductPrice = product.ProductPrice;
            updateProduct.ProductQuantity = product.ProductQuantity;
            updateProduct.ProductStatus = product.ProductStatus;
            updateProduct.CategoryId = product.CategoryId;
            updateProduct.SubCategoryId = product.SubCategoryId;
            updateProduct.ProductDescription = product.ProductDescription;
            updateProduct.Colors = product.Colors;
            updateProduct.Specifications = product.Specifications;
            updateProduct.Options = product.Options;
            await productService.UpdateOneAsync(product.Id, updateProduct);
            return Ok(urls);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteProduct")]
        public async Task<IActionResult> DeleteProduct([FromBody] string id)
        {
            Console.WriteLine(id);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("updateProductImages")]
        public async Task<IActionResult> UpdateProductImages([FromBody] UpdateProductImages data)
        {
            Product product = await productService.FindByIdAsync(data.productId);
            if(product != null)
            {
                if (product.ProductImages == null)
                {
                    product.ProductImages = new List<ProductImage>();
                    ProductImage newProductImage = new ProductImage
                    {
                        Color = data.Color!,
                        ImageURLs = data.productImages
                    };
                    product.ProductImages.Add(newProductImage);
                }
                else
                {
                    var existingProductImage = product.ProductImages.FirstOrDefault(x => x.Color == data.Color);
                    if (existingProductImage != null)
                    {
                        existingProductImage.ImageURLs.AddRange(data.productImages);
                    }
                    else
                    {
                        var newProductImage = new ProductImage
                        {
                            Color = data.Color,
                            ImageURLs = new List<string>(data.productImages)
                        };
                        product.ProductImages.Add(newProductImage);
                    }
                }
                await productService.UpdateOneAsync(product.Id!, product);
            }
            else
            {
                return BadRequest("Couldn't find product");
            }
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("getProductImagesByColor")]
        public async Task<IActionResult> GetProductImagesByColor([FromBody] GetImagesRequest request)
        {
            List<string> imageURLs = await productService.FindImagesByColorAsync(request.productId, request.color);
            return Ok(imageURLs);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("deleteProductImage")]
        public async Task<IActionResult> DeleteProductImage([FromBody] DeleteImageRequest request)
        {
            await productService.DeleteProductImage(request.productId, request.color, request.imageUrl);
            return Ok();
        }
    }
}
