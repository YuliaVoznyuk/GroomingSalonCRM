using System.ComponentModel.DataAnnotations;

namespace GroomingSalonCRM.Models
{
	public class RegisterManagerViewModel
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
		public string PhoneNumber { get; set; }
		[Required]
		public string UserName { get; set; }

		[Required]
		[MinLength(8, ErrorMessage = "Пароль має бути не менше 8 символів")]
		public string Password { get; set; }

		[Required]
		public string Role { get; set; }
	}
}
