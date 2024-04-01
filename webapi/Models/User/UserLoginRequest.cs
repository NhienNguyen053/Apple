using System.ComponentModel.DataAnnotations;
using AppleApi.Enum;

namespace AppleApi.Models.User
{
    public class UserLoginRequest
    {
        public string EmailOrPhone { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}