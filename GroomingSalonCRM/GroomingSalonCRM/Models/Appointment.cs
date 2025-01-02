namespace GroomingSalonCRM.Models
{
	public class Appointment
	{
		public int Id { get; set; }
		public DateTime Date { get; set; }
		public int AnimalId { get; set; }
		public Animal Animal { get; set; }
		public int GroomerId { get; set; }
		public Groomer Groomer { get; set; }
		public int ServiceId { get; set; }
		public Service Service { get; set; }
		public string Notes { get; set; }
		public bool IsCompleted { get; set; }
	}
}
