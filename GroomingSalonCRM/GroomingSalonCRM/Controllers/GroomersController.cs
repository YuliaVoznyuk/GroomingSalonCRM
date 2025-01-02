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
	}
}
