using IdentityApi.DTOs.Account;
using IdentityApi.Models;
using IdentityApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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

        public AccountController(JWTServices jwtServices, 
            SignInManager<User> signInManager, 
            UserManager<User> userManager)
        {
            _jwtServices = jwtServices;
            _signInManager = signInManager;
            _userManager = userManager;
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
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if(!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new JsonResult(new { title = "Account Create", message = "Your account has been created" }));
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
        #endregion
    }
}
