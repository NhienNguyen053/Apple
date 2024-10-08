﻿namespace AppleApi.Models.Order
{
    public class CustomerDetails
    {
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Address { get; set; } = null!;

        public int ZipCode { get; set; }

        public string City { get; set; } = null!;

        public string State { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;
    }
}
