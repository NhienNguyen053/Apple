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
            Product newlyAdded = await productService.InsertOneAsync(newProduct);
            return Ok(newlyAdded);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("updateProduct")]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
        {
            Product updateProduct = await productService.FindByIdAsync(product.Id);
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
                    product.ProductImages.FirstOrDefault(x => x.Color == data.Color)!.ImageURLs.AddRange(data.productImages);
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
