using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Category;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService categoryService;
    private readonly IProductService productService;

    public CategoryController(ICategoryService categoryService, IProductService productService)
    {
        this.categoryService = categoryService;
        this.productService = productService;
    }


    [HttpGet("getAllCategories")]
    public async Task<IActionResult> GetAllCategories()
    {
        List<Category> categories = await categoryService.GetAll();
        if (categories == null)
        {
            return Ok();
        }
        var dashboardCategories = ConvertToDashboardCategories(categories);
        return Ok(dashboardCategories);
    }

    [HttpGet("getCategoryByName")]
    public async Task<IActionResult> GetCategoryByName(string name)
    {
        Category category = await categoryService.FindCategoryByName(name);
        if (category == null)
        {
            return NoContent();
        } 
        else if (category.ParentCategoryId != null)
        {
            return Ok(category);
        }
        else
        {
            List<Category> categories = await categoryService.FindSubcategory(category.Id);
            var mappedCategories = ConvertToDashboardCategories(categories);
            return Ok(mappedCategories[0]);
        }
    }

    [Authorize(Roles = "Product Manager")]
    [HttpGet("getCategoryById")]
    public async Task<IActionResult> GetCategoryById(string id)
    {
        Category category = await categoryService.FindByIdAsync(id);
        if (category == null)
        {
            return NoContent();
        }
        return Ok(category);
    }

    [Authorize(Roles = "Product Manager")]
    [HttpPost("createCategory")]
    public async Task<IActionResult> CreateCategory([FromBody] Category category)
    {
        Category categoryExist = await categoryService.FindByFieldAsync("CategoryName", category.CategoryName);
        if (categoryExist != null)
        {
            return BadRequest("Category name already exist!");
        }
        var newCategory = new Category
        {
            CategoryName = category.CategoryName,
            Description = category.Description,
            VideoURL = category.VideoURL,
            ParentCategoryId = category.ParentCategoryId
        };
        Category newlyAdded = await categoryService.InsertOneAsync(newCategory);
        return Ok(newlyAdded);
    }
    
    [Authorize(Roles = "Product Manager")]
    [HttpPost("updateCategory")]
    public async Task<IActionResult> UpdateCategory([FromBody] Category category)
    {
        Category categoryExist = await categoryService.FindDifferent(category.Id, category.CategoryName);
        if (categoryExist != null)
        {
            return BadRequest("Category name already exist!");
        }
        Category oldCategory = await categoryService.FindByIdAsync(category.Id);
        var updateCategory = new Category
        {
            Id = category.Id,
            CategoryName = category.CategoryName,
            Description = category.Description,
            VideoURL = category.VideoURL,
            ImageURL = category.ImageURL == null ? oldCategory.ImageURL : category.ImageURL,
            IconURL = category.IconURL == null ? oldCategory.IconURL : category.IconURL,
            ParentCategoryId = category.ParentCategoryId
        };
        await categoryService.UpdateOneAsync(updateCategory.Id, updateCategory);
        return Ok("Updated successfully");
    }
    
    [Authorize(Roles = "Product Manager")]
    [HttpDelete("deleteCategory")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var category = await categoryService.FindByIdAsync(id);
        if(category == null)
        {
            return BadRequest("Couldn't find category!");
        }
        if (category.ParentCategoryId == null)
        {
            var childCategory = await categoryService.FindByFieldAsync("ParentCategoryId", id);
            if (childCategory != null)
            {
                return BadRequest("Can't delete category that has subcategory!");
            }
            await categoryService.DeleteOneAsync(id);
            if (category.VideoURL == null)
            {
                return Ok("No Image!");
            }
        }
        else
        {
            var productExist = await productService.FindByFieldAsync("SubCategoryId", id);
            if (productExist != null)
            {
                return Ok("Can't delete subcategory that has products!");
            }
            else
            {
                await categoryService.DeleteOneAsync(id);
                return Ok("Deleted subcategory!");
            }
        }
       
        return Ok("Delete successfully!");
    }
    private List<DashboardCategory> ConvertToDashboardCategories(List<Category> categories)
    {
        var parentCategories = categories.Where(c => c.ParentCategoryId == null).ToList();

        var dashboardCategories = parentCategories.Select(parent =>
        {
            var dashboardCategory = new DashboardCategory
            {
                Id = parent.Id,
                CategoryName = parent.CategoryName,
                Description = parent.Description,
                VideoURL = parent.VideoURL,
                ChildCategories = GetChildCategories(categories, parent.Id)
            };

            return dashboardCategory;
        }).ToList();

        return dashboardCategories;
    }

    private static List<Category> GetChildCategories(List<Category> categories, string parentId)
    {
        var childCategories = categories.Where(c => c.ParentCategoryId == parentId).ToList();
        var dashboardChildCategories = childCategories.Select(child =>
        {
            var dashboardChildCategory = new Category
            {
                Id = child.Id,
                CategoryName = child.CategoryName,
                Description = child.Description,
                VideoURL = child.VideoURL,
                ParentCategoryId = child.ParentCategoryId,
                IconURL = child.IconURL,
                ImageURL = child.ImageURL,
            };

            return dashboardChildCategory;
        }).ToList();

        return dashboardChildCategories;
    }
}