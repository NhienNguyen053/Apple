using System.ComponentModel.DataAnnotations;
using AppleApi.Enum;

namespace AppleApi.Models.User
{
    public class Driver
    {
        public string id { get; set; } = null!;
        public string name { get; set; } = null!;
    }
}