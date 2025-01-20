using GroomingSalonCRM.Data;
using GroomingSalonCRM.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GroomingSalonCRM.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AppointmentsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public AppointmentsController(ApplicationDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
		{
			return await _context.Appointments
								 .Include(a => a.Animal)
								 .Include(a => a.Groomer)
								 .Include(a => a.Service)
								 .ToListAsync();
		}

		[HttpPost]
		public async Task<ActionResult<Appointment>> AddAppointment(Appointment appointment)
		{
			_context.Appointments.Add(appointment);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetAppointments), new { id = appointment.Id }, appointment);
		}
        [HttpGet("AvailableTimes")]
        public IActionResult AvailableTimes(DateTime date, int groomerId)
        {
            date = date.Date;

            var allTimes = Enumerable.Range(9, 10).Select(h => new TimeSpan(h, 0, 0)).ToList();

            var bookedTimes = _context.Appointments
                                        .Where(a => a.Date.Date == date.Date && a.GroomerId == groomerId)
                                        .Select(a => a.Date.TimeOfDay)
                                        .ToList();

            var availableTimes = allTimes.Except(bookedTimes)
                                         .Select(ts => ts.ToString(@"hh\:mm"))
                                         .ToList();

            return Ok(availableTimes);
        }
    }
}
