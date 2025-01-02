using System.ComponentModel.DataAnnotations;

namespace GroomingSalonCRM.Models
{
	public class LoginViewModel
	{
		[Required]
		public string UserName { get; set; }
		[Required]
		public string Password { get; set; }
	
	}
}
