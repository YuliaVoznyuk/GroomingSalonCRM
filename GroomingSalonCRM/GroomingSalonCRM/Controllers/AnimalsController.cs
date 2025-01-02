using GroomingSalonCRM.Data;
using GroomingSalonCRM.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace GroomingSalonCRM.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AnimalsController : Controller
	{
		private readonly ApplicationDbContext _context;

		public AnimalsController(ApplicationDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Animal>>> GetAnimals()
		{
			return await _context.Animals.Include(a => a.Owner).ToListAsync();
		}

		[HttpPost]
		public async Task<ActionResult<Animal>> AddAnimal(Animal animal)
		{
			_context.Animals.Add(animal);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetAnimals), new { id = animal.Id }, animal);
		}
	}
}
