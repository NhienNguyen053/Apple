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
        public async Task<ActionResult<T>> Get(string value, EnumTypeGet type)
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
                var item = await _service.GetByEmailAsync(value);
                if (item == null)
                {
                    return NotFound();
                }
                return item;
            }
            else if (type == EnumTypeGet.PhoneNumber)
            {
                var item = await _service.GetByPhoneAsync(value);
                if(item == null){
                    return NotFound();
                }
                return item;
            }
            else
            {
                return BadRequest("Invalid type parameter");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(T newItem)
        {
            await _service.CreateAsync(newItem);

            return CreatedAtAction(nameof(Get), new { id = GetId(newItem) }, newItem);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, T updatedItem)
        {
            var item = await _service.GetAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            await _service.UpdateAsync(id, updatedItem);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _service.GetAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            await _service.RemoveAsync(id);

            return NoContent();
        }

        protected abstract string GetId(T item);
    }
}
