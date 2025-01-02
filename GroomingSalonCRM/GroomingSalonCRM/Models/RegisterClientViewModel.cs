using System.ComponentModel.DataAnnotations;

namespace GroomingSalonCRM.Models
{
	public class RegisterClientViewModel
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }

		[Required]
		public string Surname { get; set; }

		[Required]
		public string Name { get; set; }

		public string Middlename { get; set; }

		[Required]
		[Phone]
		public string Phone { get; set; }
		[Required]
		public string Username { get; set; }

		[Required]
		[MinLength(8, ErrorMessage = "Пароль має бути не менше 8 символів")]
		public string Password { get; set; }

		[Required]
		[Compare("Password", ErrorMessage = "Паролі не співпадають")]
		public string ConfirmPassword { get; set; }
	}
}
