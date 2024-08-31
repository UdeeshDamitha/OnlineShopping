using System.ComponentModel.DataAnnotations;

namespace IdentityApi.DTOs.Account
{
    public class ConfirmEmailDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "Invalid Email address")]
        public string Email { get; set; }
    }
}
