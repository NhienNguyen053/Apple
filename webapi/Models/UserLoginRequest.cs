using System.ComponentModel.DataAnnotations;
using webapi.Enum;

namespace AppleApi.Models{
    public class UserLoginRequest
    {
        public string EmailOrPhone { get; set; } = null!;
        public string Password { get; set; } = null!;
        public EnumTypeGet TypeRegister { get; set; }
    }   
}