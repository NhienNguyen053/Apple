using AppleApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        this.categoryService = categoryService;
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

    /*[Authorize(Roles = "Admin")]
    [HttpPost("createCategory")]
    public async Task<IActionResult> CreateCategory(Category category)
    {
        var newCategory = new Category
        {
            CategoryName = category.CategoryName,
            Description = category.Description,
            ImageURL = category.ImageURL,
            ParentCategoryId = null
        };
        Category newlyAdded = await _service.CreateAsync(newCategory);
        return Ok(newlyAdded.Id);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("createSubCategory")]
    public async Task<IActionResult> CreateSubCategory(Category category)
    {
        var newCategory = new Category
        {
            CategoryName = category.CategoryName,
            Description = category.Description,
            ImageURL = category.ImageURL,
            ParentCategoryId = category.Id
        };
        Category newlyAdded = await _service.CreateAsync(newCategory);
        return Ok(newlyAdded);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("updateCategory")]
    public async Task<IActionResult> UpdateCategory(Category category)
    {
        var updateCategory = new Category
        {
            Id = category.Id,
            CategoryName = category.CategoryName,
            Description = category.Description,
            ImageURL = category.ImageURL,
            ParentCategoryId = category.ParentCategoryId
        };
        await _service.UpdateAsync(updateCategory.Id!, updateCategory);
        return Ok("Updated successfully");
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("deleteCategory")]
    public async Task<IActionResult> DeleteCategory(string id)
    {
        var category = await _service.GetAsync(id);
        if(category == null)
        {
            return BadRequest("Couldn't find category!");
        }
        var childCategory = await _service.GetCategoryByIdAsync("ParentCategoryId", id);
        if (childCategory != null)
        {
            return BadRequest("Can't delete category that has subcategory!");
        }
        await _service.RemoveAsync(id);
        if(category.ImageURL == null)
        {
            return Ok("No Image!");
        }
        return Ok("Delete successfully!");
    }*/
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
                ImageURL = parent.ImageURL,
                ChildCategories = GetChildCategories(categories, parent.Id!)
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
                ImageURL = child.ImageURL,
                ParentCategoryId = child.ParentCategoryId
            };

            return dashboardChildCategory;
        }).ToList();

        return dashboardChildCategories;
    }
}