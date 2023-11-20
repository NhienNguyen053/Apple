using System.Security.Cryptography;
using AppleApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using webapi.Enum;
using System.Net;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Apple.Services;
using Microsoft.AspNetCore.Authorization;

namespace AppleApi.Controllers 
{
    [Route("api/[controller]")]
    public class UsersController : BaseController<User>
    {
        private readonly IConfiguration configuration;
        public UsersController(IOptions<AppleDatabaseSettings> settings, IConfiguration configuration)
            : base(settings, "User")
        {
            this.configuration = configuration;
        }

        protected override string GetId(User item) => item?.Id ?? string.Empty;

        [Authorize(Roles = "Admin")]
        [HttpPost("getall")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _service.GetAsync();
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

        [HttpPost("newUser")]
        public async Task<IActionResult> NewUser(NewUserRequest request)
        {
            var user = await _service.GetUserByAsync("Email", request.Email);
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
            await _service.CreateAsync(newUser);
            SendEmail(newUser.VerificationToken, newUser.Email);
            return Ok("Registration successful!");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterRequest request)
        {
            var user = await _service.GetUserByAsync("Email", request.Email);
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
            await _service.CreateAsync(newUser);
            SendEmail(newUser.VerificationToken, newUser.Email);
            return Ok("Registration successful!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginRequest request)
        {
            User? user;
            if (request.TypeRegister == EnumTypeGet.Email)
            {
                user = await _service.GetUserByAsync("Email", request.EmailOrPhone);
            }
            else if (request.TypeRegister == EnumTypeGet.PhoneNumber)
            {
                user = await _service.GetUserByAsync("Phone", request.EmailOrPhone);
            }
            else
            {
                return BadRequest("Invalid value");
            }
            if (user == null)
            {
                return BadRequest("User already exist!");
            }
            if (user.VerifiedAt == null){
                return BadRequest("Please verify account!");
            }
            if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt)){
                return BadRequest("Incorrect password!");
            }
            var token = CreateToken(user);
            LoggedInUser loggedInUser = new()
            {
                FirstName = user.FirstName,
                Token = token
            };
            return Ok(loggedInUser);
        }

        [HttpPost("resendemail")]
        public async Task<IActionResult> ResendEmail(string email){
            var user = await _service.GetUserByAsync("Email", email);
            if(user == null){
                return BadRequest("User not found!");
            }
            user.VerificationToken = await CreateUniqueRandomTokenAsync();
            user.VerificationTokenExpires = DateTime.Now.AddDays(1);
            await _service.UpdateAsync(user.Id!, user);
            SendEmail(user.VerificationToken, email);
            return Ok("Email sent!");
        }


        [HttpPost("sendemail")]
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

        [HttpGet("verifyemail")]
        public async Task<IActionResult> VerifyEmail(string token){
            var user = await _service.GetUserByAsync("VerificationToken", token);
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
            await _service.UpdateAsync(user.Id!, user);
            return Ok("User verified!");
        }

        [HttpPost("sendemailotp")]
        public async Task<IActionResult> SendEmailOTP(string receiveEmail)
        {
            var user = await _service.GetUserByAsync("Email", receiveEmail);
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
            await _service.UpdateAsync(user.Id!, user);
            return Ok();
        }

        [HttpPost("confirmotp")]
        public async Task<IActionResult> ConfirmOtp(string otp, string emailorphone, EnumTypeGet type){
            var user = new User();
            if(type == EnumTypeGet.Email){
                user = await _service.GetUserByAsync("Email", emailorphone);
            }else if(type == EnumTypeGet.PhoneNumber){
                user = await _service.GetUserByAsync("PhoneNumber", emailorphone);
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

        [HttpPost("send-SMS")]
        public async Task<IActionResult> SendSMS(string phone){
            var user = await _service.GetUserByAsync("PhoneNumber", phone);
            if (user == null)
            {
                return BadRequest("User not found!");
            }
            var twilioSmsService = new SMSService();
            var toPhoneNumber = user.PhoneNumber!;
            var code = GenerateCode(6);
            user.PasswordResetToken = code;
            user.ResetTokenExpires = DateTime.Now.AddMinutes(10);
            await _service.UpdateAsync(user.Id!, user);
            var messageBody = "Your password reset code is: " + code;
            twilioSmsService.SendSms(toPhoneNumber, messageBody);
            return Ok("SMS sent");
        }

        [HttpPost("updatepassword")]
        public async Task<IActionResult> UpdatePassword(string emailorphone, string newPassword, EnumTypeGet type)
        {
            var user = new User();
            if (type == EnumTypeGet.Email)
            {
                user = await _service.GetUserByAsync("Email", emailorphone);
            }
            else if (type == EnumTypeGet.PhoneNumber)
            {
                user = await _service.GetUserByAsync("PhoneNumber", emailorphone);
            }
            if (user == null)
            {
                return BadRequest("User not found!");
            }
            CreatePasswordHash(newPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await _service.UpdateAsync(user.Id, user);
            return Ok("Reset successful!");
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
            } while (await _service.TokenExistsAsync(token));
            return token;
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new()
            {
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
            string code = new(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
            return code;
        }
    }
}