using GroomingSalonCRM.Data;
using GroomingSalonCRM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroomingSalonCRM.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ClientsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public ClientsController(ApplicationDbContext context)
		{
			_context = context;
		}

		// Отримати список клієнтів з їхніми тваринами
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Client>>> GetClients()
		{
			return await _context.Users
				.OfType<Client>()
				.Include(c => c.Animals)
				.ToListAsync();
		}

		

		// Оновити інформацію про клієнта
		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateClient(int id, Client client)
		{
			if (id != client.Id)
				return BadRequest("ID does not match");

			var existingClient = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
			if (existingClient == null)
				return NotFound();

			// Оновлення властивостей клієнта
			existingClient.Surname = client.Surname;
			existingClient.Name = client.Name;
			existingClient.Middlename = client.Middlename;
			existingClient.PhoneNumber = client.PhoneNumber;

			// Оновлюємо запис в контексті
			_context.Entry(existingClient).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!_context.Clients.Any(e => e.Id == id))
					return NotFound();
				else
					throw;
			}

			return NoContent(); // Повертаємо статус 204 (No Content) після успішного оновлення
		}


		// Видалити клієнта
		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteClient(int id)
		{
			// Пошук клієнта в таблиці Clients за ідентифікатором
			var client = await _context.Clients.FirstOrDefaultAsync(c => c.Id == id);
			if (client == null)
				return NotFound();

			// Видалення клієнта
			_context.Clients.Remove(client);
			await _context.SaveChangesAsync();

			// Повернення статусу 204 (No Content)
			return NoContent();
		}

		[HttpGet("{id}")]
		public async Task<ActionResult<Client>> GetClientById(int id)
		{
			var client = await _context.Clients
				.Include(c => c.Animals) // Якщо потрібно включити тварин клієнта
				.FirstOrDefaultAsync(c => c.Id == id);

			if (client == null)
			{
				return NotFound("Клієнт не знайдений.");
			}

			return Ok(client);
		}
	}
}
