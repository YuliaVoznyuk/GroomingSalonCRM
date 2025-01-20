using GroomingSalonCRM.Data;
using GroomingSalonCRM.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace GroomingSalonCRM.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class GroomersController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public GroomersController(ApplicationDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Groomer>>> GetGroomers()
		{
			return await _context.Groomers.ToListAsync();
		}

		[HttpPost]
		public async Task<ActionResult<Groomer>> AddGroomer(Groomer groomer)
		{
			_context.Groomers.Add(groomer);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetGroomers), new { id = groomer.Id }, groomer);
		}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroomer(int id)
        {
            var groomer = await _context.Groomers.FindAsync(id);
            if (groomer == null)
            {
                return NotFound();
            }

            _context.Groomers.Remove(groomer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Groomer>> GetGroomer(int id)
        {
            var groomer = await _context.Groomers.FindAsync(id);

            if (groomer == null)
            {
                return NotFound("Грумер не знайдений");
            }

            return Ok(groomer);
        }
        [HttpPut("{id}")]
        public IActionResult UpdateGroomer(int id, [FromBody] Groomer updatedGroomer)
        {
            if (updatedGroomer == null || updatedGroomer.Id != id)
            {
                return BadRequest("Невірні дані для оновлення");
            }

            var groomer = _context.Groomers.FirstOrDefault(g => g.Id == id);
            if (groomer == null)
            {
                return NotFound("Грумер не знайдений");
            }

            groomer.Nmae = updatedGroomer.Nmae;
            groomer.Surname = updatedGroomer.Surname;
            groomer.Middlename = updatedGroomer.Middlename;
            groomer.Specialty = updatedGroomer.Specialty;

            _context.SaveChanges();
            return Ok(groomer);
        }
    }
}
