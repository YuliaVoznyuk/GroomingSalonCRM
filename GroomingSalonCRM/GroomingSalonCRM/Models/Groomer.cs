namespace GroomingSalonCRM.Models
{
	public class Groomer
	{
		public int Id { get; set; }
		public string Surname { get; set; }
		public string Nmae { get; set; }
		public string Middlename { get; set; }
		public string Specialty { get; set; } 
		public bool IsAvailable { get; set; }
		public ICollection<Appointment> Appointments { get; set; }=new List<Appointment>();
	}
}
