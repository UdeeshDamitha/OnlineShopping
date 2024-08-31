using System.ComponentModel.DataAnnotations;

namespace IdentityApi.DTOs.Account
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "Invalid Email address")]
        public string Email { get; set; }

        [Required]
        [StringLength(12, MinimumLength = 5, ErrorMessage = "Minimum length should be 5 while maximum length is 12")]
        public string NewPassword { get; set; }
    }
}
