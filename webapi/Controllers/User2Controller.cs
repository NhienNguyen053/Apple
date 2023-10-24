/*using System.Security.Claims;
using System.Security.Cryptography;
using AppleApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using Apple.Services;
using Microsoft.AspNetCore.Authorization;

namespace AppleApi.Controllers
{
    [Route("api/user2")]
    public class Users2Controller : BaseController<User2>
    {
        private readonly IConfiguration configuration;
        public Users2Controller(IOptions<AppleDatabaseSettings> settings, IConfiguration configuration)
            : base(settings, "User2")
        {
            this.configuration = configuration;
        }

        protected override string GetId(User2 item) => item?.Id ?? string.Empty;

        [HttpPost("register2")]
        public async Task<IActionResult> Register(User2RegisterRequest request)
        {
            var existingUser = await _service.GetByUsernameAsync(request.Username);
            if (existingUser != null)
            {
                return BadRequest("User already exists!");
            }
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            CreateAnswerHash(request.Answer, out byte[] answerHash, out byte[] answerSalt);
            var newUser = new User2
            {
                Username = request.Username,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                QuestionId = request.QuestionId,
                AnswerHash = answerHash,
                AnswerSalt = answerSalt,
                PhoneNumber = request.PhoneNumber
            };
            await _service.CreateAsync(newUser);
            return Ok("Registration successful!");
        }

        [HttpPost("login2")]
        public async Task<IActionResult> Login(User2LoginRequest request)
        {
            var existingUser = await _service.GetByUsernameAsync(request.Username);
            if (existingUser == null)
            {
                return BadRequest("User not found!");
            }
            if(!VerifyPasswordHash(request.Password, existingUser.PasswordHash, existingUser.PasswordSalt)){
                IncrementFailedLoginAttempts(request.Username);
                var failedAttemptsCount = GetFailedLoginAttempts(request.Username);
                if(existingUser.PhoneNumber != ""){
                    if (HasExceededFailedLoginAttempts(request.Username))
                    {
                        return BadRequest("Login failed! Number failed: " + failedAttemptsCount + " Do you want to reset password via SMS?");
                    }
                }
                return BadRequest("Login failed! Number failed: " + failedAttemptsCount);
            }
            ResetFailedLoginAttempts(request.Username);
            var token = CreateToken(existingUser);
            var handler = new JwtSecurityTokenHandler();
            var jsontoken = handler.ReadJwtToken(token);
            var usernameClaim = jsontoken.Claims.FirstOrDefault(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name");
            var username = usernameClaim!.Value;
            var result = new { username, token };
            var resultJson = JsonConvert.SerializeObject(result);
            return Ok(resultJson);
        }

        [Authorize]
        [HttpPost("updateuser2")]
        public async Task<IActionResult> UpdateUser2(User2UpdateRequest request)
        {
            var existingUser = await _service.GetByUsernameAsync(request.Username);
            if (existingUser == null)
            {
                return BadRequest("User not found!");
            }
            existingUser.PhoneNumber = request.PhoneNumber;
            await _service.UpdateAsync(existingUser.Id!, existingUser);
            return Ok("User Updated");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string username){
            var existingUser = await _service.GetByUsernameAsync(username);
            if (existingUser == null)
            {
                return BadRequest("User not found!");
            }
            existingUser.PasswordResetToken = await CreateUniqueRandomTokenAsync();
            existingUser.ResetTokenExpires = DateTime.Now.AddHours(1);
            
            await _service.UpdateAsync(existingUser.Id!, existingUser);
            return Ok("You may reset password!");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(User2ResetRequest request){
            var existingUser = await _service.GetByTokenAsync(request.Token);
            if (existingUser == null || existingUser.ResetTokenExpires < DateTime.Now)
            {
                return BadRequest("Invalid token!");
            }
            if(existingUser.QuestionId == request.QuestionId && VerifyAnswerHash(request.Answer, existingUser.AnswerHash, existingUser.AnswerSalt)){
                CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
                existingUser.PasswordHash = passwordHash;
                existingUser.PasswordSalt = passwordSalt;
                existingUser.PasswordResetToken = null;
                existingUser.ResetTokenExpires = null;
                await _service.UpdateAsync(existingUser.Id!, existingUser);
                return Ok("Password successfully reset!");
            }else {
                return BadRequest("Wrong security question!");
            }
        }
        [HttpPost("send-SMS")]
        public async Task<IActionResult> SendSMS(string username){
            var existingUser = await _service.GetByUsernameAsync(username);
            if (existingUser == null)
            {
                return BadRequest("User not found!");
            }
            var twilioSmsService = new SMSService();
            var toPhoneNumber = existingUser.PhoneNumber!;
            var code = GenerateCode(6);
            var messageBody = "Your password reset code is: " + code;
            StoreResetCodeInSession(username, code);
            twilioSmsService.SendSms(toPhoneNumber, messageBody);
            return Ok("SMS sent");
        }
        [HttpPost("verify-SMS")]
        public IActionResult VerifySMS(string username, string enteredCode)
        {
            var storedCode = HttpContext.Session.GetString($"{username}_ResetCode");
            if (storedCode != null && enteredCode.Equals(storedCode, StringComparison.OrdinalIgnoreCase))
            {
                return Ok("Correct code");
            }
            else
            {
                return BadRequest("Incorrect code");
            }
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
        private void CreateAnswerHash(string answer, out byte[] answerHash, out byte[] answerSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                answerSalt = hmac.Key;
                answerHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(answer));
            }
        }
        private bool VerifyAnswerHash(string answer, byte[] answerHash, byte[] answerSalt)
        {
            using (var hmac = new HMACSHA512(answerSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(answer));
                return computedHash.SequenceEqual(answerHash);
            }
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
        private bool HasExceededFailedLoginAttempts(string username)
        {
            var failedAttemptsCount = HttpContext.Session.GetInt32($"{username}_FailedAttempts") ?? 0;
            return failedAttemptsCount >= 5;
        }

        private void ResetFailedLoginAttempts(string username)
        {
            HttpContext.Session.SetInt32($"{username}_FailedAttempts", 0);
        }

        private void IncrementFailedLoginAttempts(string username)
        {
            var failedAttemptsCount = HttpContext.Session.GetInt32($"{username}_FailedAttempts") ?? 0;

            failedAttemptsCount++;

            HttpContext.Session.SetInt32($"{username}_FailedAttempts", failedAttemptsCount);
        }
        private int GetFailedLoginAttempts(string username)
        {
            return HttpContext.Session.GetInt32($"{username}_FailedAttempts") ?? 0;
        }
        private void StoreResetCodeInSession(string username, string code)
        {
            HttpContext.Session.SetString($"{username}_ResetCode", code);
        }
        private string CreateToken(User2 user2)
        {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user2.Username)
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
        private string GenerateCode(int length)
        {
            const string chars = "0123456789";
            var random = new Random();
            string code = new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
            return code;
        }
    }
}*/