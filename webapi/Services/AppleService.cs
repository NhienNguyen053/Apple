using AppleApi.Models;
using Microsoft.Extensions.Options;

namespace Apple.Services
{
    public class CategoryService : MongoService<Category>
    {
        public CategoryService(IOptions<AppleDatabaseSettings> settings)
            : base(settings, settings.Value.CategoriesCollectionName)
        {
        }
    }
    public class UserService : MongoService<User>
    {
        public UserService(IOptions<AppleDatabaseSettings> settings)
            : base(settings, settings.Value.UsersCollectionName)
        {
        }
    }
}
