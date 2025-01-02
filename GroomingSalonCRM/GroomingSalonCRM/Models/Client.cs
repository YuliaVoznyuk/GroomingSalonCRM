using Microsoft.AspNetCore.Identity;

namespace GroomingSalonCRM.Models
{
	public class Client: IdentityUser<int>
	{
		public string Surname { get; set; }
		public string Name { get; set; }
		public string Middlename { get; set; }
		public string Phone { get; set; }

		public ICollection<Animal> Animals { get; set; }
	}
}
