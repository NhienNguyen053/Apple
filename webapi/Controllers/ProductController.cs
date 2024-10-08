using AppleApi.Interfaces;
using AppleApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using AppleApi.Models.Product;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Drawing;

namespace AppleApi.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService productService;
        private readonly IShoppingCartService shoppingCartService;

        public ProductController(IProductService productService, IShoppingCartService shoppingCartService)
        {
            this.productService = productService;
            this.shoppingCartService = shoppingCartService;
        }

        [HttpGet("getAllProducts")]
        public async Task<IActionResult> GetAllProducts()
        {
            List<Product> products = await productService.GetAll();
            return Ok(products);
        }

        [HttpGet("getCategoryProducts")]
        public async Task<IActionResult> GetCategoryProducts(string id)
        {
            List<Product> products = await productService.FindCategoryProducts(id);
            if (products.Count == 0)
            {
                return NoContent();
            }
            return Ok(products);
        }

        [HttpGet("getProducts")]
        public async Task<IActionResult> GetProducts(string categoryId, string subcategoryId, string price, string status, string name, int pageIndex, int pageSize)
        {
            (List<Product> products, long totalCount) = await productService.FindProductsByFilter(categoryId, subcategoryId, price, status, name, pageIndex, pageSize);
            if (products.Count == 0)
            {
                return NoContent();
            }
            ProductsWithPaging response = new ProductsWithPaging
            {
                products = products,
                totalCount = totalCount,
            };
            return Ok(response);
        }

        [Authorize(Roles = "Product Manager")]
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

        [HttpGet("getProductByName")]
        public async Task<IActionResult> GetProductByName(string category, string name)
        {
            Product product = await productService.FindProductByName(category, name);
            if (product == null)
            {
                return NoContent();
            }
            return Ok(product);
        }

        [HttpGet("getRelatedProducts")]
        public async Task<IActionResult> GetRelatedProducts(string subcategoryId, string id)
        {
            List<Product> products = await productService.FindRelatedProducts(subcategoryId, id);
            if (products == null)
            {
                return NoContent();
            }
            return Ok(products);
        }

        [Authorize(Roles = "Product Manager")]
        [HttpPost("createProduct")]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            Product productExist = await productService.FindByFieldAsync("ProductName", product.ProductName);
            if (productExist != null)
            {
                return BadRequest("Product name already exist!");
            }
            Product newProduct = new();
            Product newestProduct = await productService.FindNewest("ProductNumber");
            if (newestProduct != null)
            {
                newProduct.ProductNumber = newestProduct.ProductNumber + 1;
            }
            else
            {
                newProduct.ProductNumber = 10000;
            }
            newProduct.ProductName = product.ProductName;
            newProduct.ProductPrice = product.ProductPrice;
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

        [Authorize(Roles = "Product Manager")]
        [HttpPost("updateProduct")]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
        {
            List<string> removedColors = new List<string>();
            List<string> removedMemory = new List<string>();
            List<string> removedStorage = new List<string>();
            Product productExist = await productService.FindDifferent(product.Id, product.ProductName);
            if (productExist != null)
            {
                return BadRequest("Product name already exist!");
            }
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

            foreach (var color in updateProduct.Colors)
            {
                if (!product.Colors.Contains(color))
                {
                    removedColors.Add(color);
                }
            }

            foreach (var memory in updateProduct.Options.Memory)
            {
                if (!product.Options.Memory.Contains(memory))
                {
                    removedMemory.Add(memory);
                }
            }

            foreach (var storage in updateProduct.Options.Storage)
            {
                if (!product.Options.Storage.Contains(storage))
                {
                    removedStorage.Add(storage);
                }
            }
            
            if (removedColors.Count > 0)
            {
                foreach (var color in removedColors)
                {
                    await shoppingCartService.DeleteByFieldAsync("Color", color);
                }
            }

            if (removedMemory.Count > 0)
            {
                foreach (var memory in removedMemory)
                {
                    await shoppingCartService.DeleteByFieldAsync("Memory", memory);
                }
            }

            if (removedStorage.Count > 0)
            {
                foreach (var storage in removedStorage)
                {
                    await shoppingCartService.DeleteByFieldAsync("Storage", storage);
                }
            }

            if (updateProduct.ProductStatus != product.ProductStatus && product.ProductStatus == "Inactive")
            {
                await shoppingCartService.DeleteByFieldAsync("ProductId", product.Id);
            }
            updateProduct.ProductName = product.ProductName;
            updateProduct.ProductPrice = product.ProductPrice;
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

        [Authorize(Roles = "Product Manager")]
        [HttpDelete("deleteProduct")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            List<string> allImageURLs = new();
            Product product = await productService.FindByIdAsync(id);
            foreach(var productImages in product.ProductImages)
            {
                allImageURLs.AddRange(productImages.ImageURLs);
            }
            await productService.DeleteOneAsync(id);
            await shoppingCartService.DeleteByFieldAsync("ProductId", id);
            return Ok(allImageURLs);
        }

        [Authorize(Roles = "Product Manager")]
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
                await productService.UpdateOneAsync(product.Id, product);
            }
            else
            {
                return BadRequest("Couldn't find product");
            }
            return Ok();
        }

        [Authorize(Roles = "Product Manager")]
        [HttpPost("getProductImagesByColor")]
        public async Task<IActionResult> GetProductImagesByColor([FromBody] GetImagesRequest request)
        {
            List<string> imageURLs = await productService.FindImagesByColorAsync(request.productId, request.color);
            return Ok(imageURLs);
        }

        [Authorize(Roles = "Product Manager")]
        [HttpPost("deleteProductImage")]
        public async Task<IActionResult> DeleteProductImage([FromBody] DeleteImageRequest request)
        {
            await productService.DeleteProductImage(request.productId, request.color, request.imageUrl);
            return Ok();
        }
    }
}
