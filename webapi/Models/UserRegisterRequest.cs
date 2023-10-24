using System.ComponentModel.DataAnnotations;
using webapi.Enum;

namespace AppleApi.Models{
    public class UserRegisterRequest
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Country { get; set; } = null!;
        public DateTime Birthday { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }   
}