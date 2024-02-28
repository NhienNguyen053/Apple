using System.ComponentModel.DataAnnotations;
using webapi.Enum;

namespace webapi.Models.User
{
    public class UserLoginRequest
    {
        public string EmailOrPhone { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}