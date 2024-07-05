using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using AppleApi.Enum;
using System.Net;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AppleApi.Services;
using Microsoft.AspNetCore.Authorization;
using AppleApi.Interfaces;
using System.Text.RegularExpressions;
using AppleApi.Models.User;

namespace AppleApi.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IConfiguration configuration;

        public UsersController(IUserService userService, IConfiguration configuration)
        {
            this.configuration = configuration;
            this.userService = userService;
        }

        [Authorize(Roles = "Admin, Employee")]
        [HttpGet("getAllUsers")]
        public async Task<IActionResult> GetAll()
        {
            var users = await userService.GetAll();
            if(users == null)
            {
                return Ok();
            }
            List<DashboardUser> dashboardUserList = new();

            foreach (User user in users)
            {
                DashboardUser dashboardUser = new()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Country = user.Country,
                    Birthday = user.Birthday,
                    Email = user.Email,
                    Phone = user.PhoneNumber,
                    Role = user.Role,
                    VerifiedAt = user.VerifiedAt
                };
                dashboardUserList.Add(dashboardUser);
            }
            return Ok(dashboardUserList);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("getUserById")]
        public async Task<IActionResult> GetUserById(string id)
        {
            User user = await userService.FindByIdAsync(id);
            if (user == null)
            {
                return NoContent();
            }
            User returnUser = new()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Country = user.Country,
                Birthday = user.Birthday,
                Role = user.Role
            };
            return Ok(returnUser);
        }

        [HttpPost("getUser")]
        public async Task<IActionResult> GetUser(string emailOrPhone)
        {
            bool isPhoneNumber = Regex.IsMatch(emailOrPhone, @"^[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-]+$");
            if (isPhoneNumber)
            {
                User user = await userService.FindByFieldAsync("PhoneNumber", emailOrPhone);
                if (user == null)
                {
                    return NoContent();
                }
                if (user.VerifiedAt == null)
                {
                    return Ok("User not verified!");
                }
                return Ok();
            }
            else
            {
                User user = await userService.FindByFieldAsync("Email", emailOrPhone);
                if(user == null)
                {
                    return NoContent();
                }
                if (user.VerifiedAt == null)
                {
                    return Ok("User not verified!");
                }
                return Ok();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("newUser")]
        public async Task<IActionResult> NewUser([FromBody] NewUserRequest request)
        {
            var user = await userService.FindByFieldAsync("Email", request.Email);
            if (user != null)
            {
                if (user.VerifiedAt == null)
                {
                    return BadRequest("Please verify account!");
                }
                return BadRequest("User already exist!");
            }
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Country = request.Country,
                Birthday = request.Birthday,
                PhoneNumber = null!,
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = await CreateUniqueRandomTokenAsync(),
                VerificationTokenExpires = DateTime.Now.AddDays(1),
                Role = request.Role
            };
            await userService.InsertOneAsync(newUser);
            SendEmail(newUser.VerificationToken, newUser.Email);
            return Ok("Registration successful!");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            var user = await userService.FindByFieldAsync("Email", request.Email);
            if(user != null)
            {
                if(user.VerifiedAt == null){
                    return BadRequest("Please verify account!");
                }
                return BadRequest("User already exist!");
            }
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Country = request.Country,
                Birthday = request.Birthday,
                PhoneNumber = null!,
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = await CreateUniqueRandomTokenAsync(),
                VerificationTokenExpires = DateTime.Now.AddDays(1),
                Role = "Customer"
            };
            await userService.InsertOneAsync(newUser);
            SendEmail(newUser.VerificationToken, newUser.Email);
            return Ok("Registration successful!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            bool isPhoneNumber = Regex.IsMatch(request.EmailOrPhone, @"^[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-]+$");
            User? user;
            if (isPhoneNumber)
            {
                user = await userService.FindByFieldAsync("PhoneNumber", request.EmailOrPhone);
            }
            else
            {
                user = await userService.FindByFieldAsync("Email", request.EmailOrPhone);
            }
            if (user == null)
            {
                return NoContent();
            }
            if(user.VerifiedAt == null)
            {
                return Unauthorized();
            }
            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt)){
                return BadRequest();
            }
            var token = CreateToken(user);
            return Ok(token);
        }

        [HttpPost("resendEmail")]
        public async Task<IActionResult> ResendEmail(string email){
            var user = await userService.FindByFieldAsync("Email", email);
            if(user == null){
                return BadRequest("User not found!");
            }
            user.VerificationToken = await CreateUniqueRandomTokenAsync();
            user.VerificationTokenExpires = DateTime.Now.AddDays(1);
            await userService.UpdateOneAsync(user.Id, user);
            SendEmail(user.VerificationToken, email);
            return Ok("Email sent!");
        }


        [HttpPost("sendEmail")]
        public IActionResult SendEmail(string token, string receiveEmail)
        {
            string senderEmail = "nhiennguyen3999@gmail.com";
            string senderPassword = "gadj yvyj dhlg ixpj";
            string recipientEmail = receiveEmail;
            var body2 = "https://localhost:7061/api/Users/verifyemail?token=";
            var encodedlink = WebUtility.UrlEncode(token);
            var body = $@"<p>Click the link below to verify your email:</p><a href=""{body2 + encodedlink}"" target=""_blank"">Verify Email</a>";
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(senderEmail));
            email.To.Add(MailboxAddress.Parse(recipientEmail));
            email.Subject = "Activation Link";
            email.Body = new TextPart(TextFormat.Html) { Text = body };
            using (var smtp = new SmtpClient())
            {
                smtp.Connect("smtp.gmail.com", 587, false);
                smtp.Authenticate(senderEmail, senderPassword);
                smtp.Send(email);
                smtp.Disconnect(true);
            }
            return Ok();
        }

        [HttpGet("verifyEmail")]
        public async Task<IActionResult> VerifyEmail(string token){
            var user = await userService.FindByFieldAsync("VerificationToken", token);
            if (user == null)
            {
                return BadRequest("User not found!");
            }
            if(DateTime.Now > user.VerificationTokenExpires){
                return BadRequest("Token has expired!");
            }
            user.VerifiedAt = DateTime.Now;
            user.VerificationToken = null;
            user.VerificationTokenExpires = null;
            await userService.UpdateOneAsync(user.Id, user);
            return Ok("User verified!");
        }

        [HttpPost("sendEmailOtp")]
        public async Task<IActionResult> SendEmailOTP(string receiveEmail)
        {
            var user = await userService.FindByFieldAsync("Email", receiveEmail);
            if (user == null)
            {
                return BadRequest("User not found!");
            }
            string senderEmail = "nhiennguyen3999@gmail.com";
            string senderPassword = "gadj yvyj dhlg ixpj";
            string recipientEmail = receiveEmail;
            string verificationcode = GenerateCode(6);
            var body = $@"<p>Your verification code: {verificationcode}</p>";
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(senderEmail));
            email.To.Add(MailboxAddress.Parse(recipientEmail));
            email.Subject = "Password reset verification code";
            email.Body = new TextPart(TextFormat.Html) { Text = body };
            using (var smtp = new SmtpClient())
            {
                smtp.Connect("smtp.gmail.com", 587, false);
                smtp.Authenticate(senderEmail, senderPassword);
                smtp.Send(email);
                smtp.Disconnect(true);
            }
            user.PasswordResetToken = verificationcode;
            user.ResetTokenExpires = DateTime.Now.AddMinutes(10);
            await userService.UpdateOneAsync(user.Id, user);
            return Ok();
        }

        [HttpPost("confirmOtp")]
        public async Task<IActionResult> ConfirmOtp(string otp, string emailorphone, EnumTypeGet type){
            var user = new User();
            if(type == EnumTypeGet.Email){
                user = await userService.FindByFieldAsync("Email", emailorphone);
            }else if(type == EnumTypeGet.PhoneNumber){
                user = await userService.FindByFieldAsync("PhoneNumber", emailorphone);
            }
            if(user == null){
                return BadRequest("User not found!");
            }
            if(user.PasswordResetToken != otp){
                return BadRequest("Wrong otp!");
            }
            if(user.ResetTokenExpires < DateTime.UtcNow){
                return BadRequest("Otp expired!");
            }
            return Ok();
        }

        [HttpPost("sendSMS")]
        public async Task<IActionResult> SendSMS(string phone){
            var user = await userService.FindByFieldAsync("PhoneNumber", phone);
            if (user == null)
            {
                return BadRequest("User not found!");
            }
            var twilioSmsService = new SMSService();
            var toPhoneNumber = user.PhoneNumber!;
            var code = GenerateCode(6);
            user.PasswordResetToken = code;
            user.ResetTokenExpires = DateTime.Now.AddMinutes(10);
            await userService.UpdateOneAsync(user.Id, user);
            var messageBody = "Your password reset code is: " + code;
            twilioSmsService.SendSms(toPhoneNumber, messageBody);
            return Ok("SMS sent");
        }

        [HttpPost("updatePassword")]
        public async Task<IActionResult> UpdatePassword(string emailorphone, string newPassword)
        {
            var user = new User();
            bool isPhoneNumber = Regex.IsMatch(emailorphone, @"^[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-]+$");
            if (!isPhoneNumber)
            {
                user = await userService.FindByFieldAsync("Email", emailorphone);
            }
            else
            {
                user = await userService.FindByFieldAsync("PhoneNumber", emailorphone);
            }
            if (user == null)
            {
                return BadRequest("User not found!");
            }
            CreatePasswordHash(newPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await userService.UpdateOneAsync(user.Id, user);
            return Ok("Reset successful!");
        }

        [HttpPost("updateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
        {
            var user = await userService.FindByIdAsync(request.id);
            if(user == null)
            {
                return NoContent();
            }
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Country = request.Country;
            user.Birthday = request.Birthday;
            if (user.Email == "nhiennguyen3999@gmail.com")
            {
                user.Role = "Admin";
            }
            else
            {
                user.Role = request.Role;
            }
            await userService.UpdateOneAsync(request.id, user);
            return Ok("Update successful!");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteUser")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await userService.FindByIdAsync(id);
            if (user == null)
            {
                return NoContent();
            }
            if (user.Email == "nhiennguyen3999@gmail.com")
            {
                return BadRequest("Can't delete this admin account");
            }
            await userService.DeleteOneAsync(id);
            return Ok("Delete successful");
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }
        private static bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512(passwordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(passwordHash);
        }
        private async Task<string> CreateUniqueRandomTokenAsync()
        {
            string token;
            do
            {
                token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
            } while (await userService.TokenExistsAsync(token));
            return token;
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new()
            {
                new Claim("Id", user.Id),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim("Email", user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value!));
            var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credential
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
        private static string GenerateCode(int length)
        {
            const string chars = "0123456789";
            var random = new Random();
            string code = new(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
            return code;
        }
    }
}