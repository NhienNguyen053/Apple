using Apple.Services;
using AppleApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using webapi.Enum;

namespace AppleApi.Controllers
{
    [ApiController]
    public abstract class BaseController<T> : ControllerBase where T : class
    {
        protected readonly MongoService<T> _service;

        protected BaseController(IOptions<AppleDatabaseSettings> settings, string collectionName)
        {
            _service = new MongoService<T>(settings, collectionName);
        }

        [HttpGet]
        public async Task<List<T>> Get() =>
            await _service.GetAsync();

        [HttpGet("{value}")]
        public async Task<ActionResult<object>> Get(string value, EnumTypeGet type)
        {
            if (type == EnumTypeGet.Id)
            {
                var item = await _service.GetAsync(value);
                if (item == null)
                {
                    return NotFound();
                }
                return item;
            }
            else if (type == EnumTypeGet.Email)
            {
                var item = await _service.GetUserByAsync("Email", value);
                if (item == null)
                {
                    return NotFound();
                }
                return new UserReturn { VerifiedAt = item.VerifiedAt };
            }
            else if (type == EnumTypeGet.PhoneNumber)
            {
                var item = await _service.GetUserByAsync("PhoneNumber", value);
                if (item == null)
                {
                    return NotFound();
                }
                return new UserReturn { VerifiedAt = item.VerifiedAt };
            }
            else
            {
                return BadRequest("Invalid type parameter");
            }
        }

        protected abstract string GetId(T item);
    }
}
