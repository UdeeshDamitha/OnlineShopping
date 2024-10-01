using IdentityApi.DTOs.Account;
using IdentityApi.Models;
using IdentityApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IdentityApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly JWTServices _jwtServices;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public AccountController(JWTServices jwtServices, 
            SignInManager<User> signInManager, 
            UserManager<User> userManager, EmailService emailService,
            IConfiguration config)
        {
            _jwtServices = jwtServices;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
            _config = config;
        }

        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) return Unauthorized("Invalid user name or password");
            if (user.EmailConfirmed == false) return Unauthorized("Please confirm your email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid User name or password");
            return CreateApplicationUserDto(user);

        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto model) 
        {
            if (await CheckEmailExistsAsync(model.Email)) 
            {
              //  return BadRequest($"An existing account is using {model.Email}, email addres. Please try with another email address");
                return BadRequest(new JsonResult(new { title = "Account Created Failed", message = $"An existing account is using {model.Email}, email addres. Please try with another email address" }));
            }

            var userToAdd = new User
            {
                FirstName = model.FirstName.ToLower(),
                LastName = model.LastName.ToLower(),
                UserName = model.Email.ToLower(),
                Email = model.Email.ToLower(),
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if(!result.Succeeded) return BadRequest(result.Errors);
            try
            {
                if(await SendConfirmEMailAsync(userToAdd))
                {
                    return Ok(new JsonResult(new { title = "Account Create", message = "Your account has been created. Please confirm your email address" }));
                }
                return BadRequest("Fail to send email. Please contact admin");
            }
            catch(Exception)
            {
                return BadRequest("Fail to send email. Please contact admin");
            }

           // return Ok(new JsonResult(new { title = "Account Create", message = "Your account has been created" }));
        }

        [HttpPut("ConfirmEmail-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) { return Unauthorized("This email address has not been registered yet");}
            if (user.EmailConfirmed == true) { return BadRequest("Your email was confirmed before. Please login to your account"); }

            try 
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                if (result.Succeeded) 
                {
                    return Ok(new JsonResult(new { title = "Email Confirmed", message = "Your email address is confirmed. You can login now" }));
                }

                return BadRequest("Invalid token. Please try again");
            }
            catch(Exception) {
                return BadRequest("Invalid token. Please try again");
            }
        }

        [HttpPost("resend-email-confirmation-link/{email}")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid Email");
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("This email has not registered yet");
            if (user.EmailConfirmed == true) return BadRequest("Your email confirmed before. Please login");

            try
            {
                if(await SendConfirmEMailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "Confirmation link sent", message = "Please confirm your email address" }));
                }
                return BadRequest("Fail to send email. Please contact admin");
            }
            catch (Exception)
            {
                return BadRequest("Fail to send email. Please contact admin");
            }
        }

        [HttpPost("forgot-username-password/{email}")]
        public async Task<IActionResult> ForgotUserNameOrPassword(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid Email");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Unauthorized("This email has not registered yet");
            if (user.EmailConfirmed == false) return BadRequest("Please confirm your email first");

            try
            {
                if (await SendForgotUsernameOrPasswordEmail(user))
                {
                    return Ok(new JsonResult(new { title = "Forgot Username or password email sent", message = "Please check your email" }));
                }
                return BadRequest("Fail to send email. Please contact admin");
            }
            catch (Exception)
            {
                return BadRequest("Fail to send email. Please contact admin");
            }

        }

        [HttpGet("chek-email")]
        public async Task<bool> CheckEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email)) throw new ArgumentNullException("email");
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) { return false; }
            else { return true; }
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("This email has not registered yet");
            if (user.EmailConfirmed == false) return BadRequest("Please confirm your email first");

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
                var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { title = "Password Reset sucess", message = "Your password has been reset" }));
                }

                return BadRequest("Invalid token. Please try again");
            }
            catch(Exception)
            {
                return BadRequest("Invalid token. Please try again");
            }
        }


        #region Private Helper Methods
        private UserDto CreateApplicationUserDto(User user)
        {
            return new UserDto 
            { 
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT=_jwtServices.CreateJWT(user),

            };
        }

        private async Task<bool> CheckEmailExistsAsync(string email) 
        {
        return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }

        private async Task<bool> SendConfirmEMailAsync(User user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ConfirmationEmailPath"]}?token={token}&email={user.Email}";
            var body = $"<P>Hello : {user.FirstName} {user.LastName}</p>" +
                "<p>Please confirm your email address by clicking on the following link</p>" +
                $"<p><a href=\"{url}\">Click Here</a></p>" +
                "<p>Thank you</P>" +
                $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "Confirm your email", body);
            return await _emailService.SendEmailAsync(emailSend);
        }

        private async Task<bool> SendForgotUsernameOrPasswordEmail(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ResetPsswordPath"]}?token={token}&email={user.Email}";

            var body = $"<P>Hello : {user.FirstName} {user.LastName}</p>" +
                $"<p>Username:{user.UserName} </p>" +
                "<p> In order to reset your password, Please click on the following link.</p>" +
                $"<p><a href=\"{url}\">Click Here</a></p>" +
                "<p>Thank you</P>" +
                $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "Forgot Email or Password", body);
            return await _emailService.SendEmailAsync(emailSend);
        }
        #endregion
    }
}
