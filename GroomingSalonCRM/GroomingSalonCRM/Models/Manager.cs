using Microsoft.AspNetCore.Identity;

namespace GroomingSalonCRM.Models
{
	public class Manager:IdentityUser<int>
	{
		public string Surname { get; set; }
		public string Name { get; set; }
		public string Middlename { get; set; }
		public string Role { get; set; }
	}
}
