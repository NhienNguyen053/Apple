using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AppleApi.Interfaces;
using AppleApi.Models.Category;

namespace AppleApi.Controllers;

[Route("api/[controller]")]
public class GoogleCloudController : ControllerBase
{
    public GoogleCloudController()
    {
    }

}