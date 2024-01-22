using System.ComponentModel.DataAnnotations;

namespace IdentityApi.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(30, MinimumLength =3, ErrorMessage ="Minimum length should be 3 while maximum length is 30")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "Minimum length should be 3 while maximum length is 30")]
        public string LastName { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage ="Invalid Email address")]
        public string Email { get; set; }
        [Required]
        [StringLength(12, MinimumLength = 5, ErrorMessage = "Minimum length should be 5 while maximum length is 12")]
        public string Password { get; set; }
    }
}
