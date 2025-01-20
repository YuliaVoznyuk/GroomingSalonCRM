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
			return await _context.Animals.ToListAsync();
		}

		[HttpPost]
		public async Task<ActionResult<Animal>> AddAnimal(Animal animal)
		{
            
            _context.Animals.Add(animal);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetAnimals), new { id = animal.Id }, animal);
		}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            var animal = await _context.Animals.FindAsync(id);
            if (animal == null)
            {
                return NotFound();
            }

            _context.Animals.Remove(animal);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> GetAnimal(int id)
        {
            var animal = await _context.Animals.FindAsync(id);

            if (animal == null)
            {
                return NotFound("Тварину не знайдено");
            }

            return Ok(animal);
        }
        [HttpPut("{id}")]
        public IActionResult UpdateAnimal(int id, [FromBody] Animal updatedAnimal)
        {
            if (updatedAnimal == null || updatedAnimal.Id != id)
            {
                return BadRequest("Невірні дані для оновлення");
            }

            var animal = _context.Animals.FirstOrDefault(g => g.Id == id);
            if (animal == null)
            {
                return NotFound("Грумер не знайдений");
            }

            animal.Name = updatedAnimal.Name;
            animal.Species = updatedAnimal.Species;
            animal.Breed = updatedAnimal.Breed;
            animal.Age = updatedAnimal.Age;

            _context.SaveChanges();
            return Ok(animal);
        }
    }
}
