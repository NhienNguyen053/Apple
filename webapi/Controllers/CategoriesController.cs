using Apple.Services;
using AppleApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class CategoriesController : BaseController<Category>
{
    public CategoriesController(IOptions<AppleDatabaseSettings> settings)
        : base(settings, "Category")
    {
    }

    protected override string GetId(Category item) => item?.Id ?? string.Empty;
}