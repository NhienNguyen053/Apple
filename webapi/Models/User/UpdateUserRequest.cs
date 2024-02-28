namespace webapi.Models.User
{
    public class UpdateUserRequest
    {
        public string id { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Country { get; set; } = null!;
        public DateTime Birthday { get; set; }
        public string Role { get; set; } = null!;
    }
}
