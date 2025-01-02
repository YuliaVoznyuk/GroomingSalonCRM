using GroomingSalonCRM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace GroomingSalonCRM.Data
{
	public class ApplicationDbContext : IdentityDbContext<IdentityUser<int>, IdentityRole<int>, int>


	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

		public DbSet<Animal> Animals { get; set; }
		public DbSet<Client> Clients { get; set; }
		public DbSet<Appointment> Appointments { get; set; }
		public DbSet<Groomer> Groomers { get; set; }
		public DbSet<Service> Services { get; set; }
		public DbSet<Manager> Managers { get; set; }
		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);


			// Спеціалізація ролей, якщо потрібно
			builder.Entity<Manager>().ToTable("Managers");
			builder.Entity<Client>().ToTable("Clients");
		}
	}
}
