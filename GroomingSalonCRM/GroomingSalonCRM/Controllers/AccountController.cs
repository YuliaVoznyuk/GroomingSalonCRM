using GroomingSalonCRM.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GroomingSalonCRM.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AccountController : ControllerBase
	{
	
		private readonly SignInManager<IdentityUser<int>> _signInManager;
		private readonly UserManager<IdentityUser<int>> _userManager;
		private readonly RoleManager<IdentityRole<int>> _roleManager;

		
		public AccountController(UserManager<IdentityUser<int>> userManager, RoleManager<IdentityRole<int>> roleManager, SignInManager<IdentityUser<int>> signInManager)
		{
			_userManager = userManager;
			_roleManager = roleManager;
			_signInManager = signInManager;
		}

		[HttpPost("RegisterClient")]
		public async Task<IActionResult> RegisterClient([FromBody] RegisterClientViewModel model)
		{
			var client = new Client
			{
				UserName = model.Username,
				Email = model.Email,
				Name = model.Name,
				Surname = model.Surname,
				Middlename = model.Middlename,
				Phone = model.Phone
			};

			var result = await _userManager.CreateAsync(client, model.Password);
			if (!result.Succeeded) return BadRequest(result.Errors);
			if (!await _roleManager.RoleExistsAsync("Client"))
				await _roleManager.CreateAsync(new IdentityRole<int> { Name = "Client" });

			await _userManager.AddToRoleAsync(client, "Client");

			var signInResult = await _signInManager.PasswordSignInAsync(
		   client.UserName, 
		   model.Password,   
		   isPersistent: true, 
		   lockoutOnFailure: false 
	   );
			if (signInResult.Succeeded)
			{
				return Ok(new
				{
					UserId = client.Id,
					Role = "Client"
				});
			}

			return BadRequest("Client registered, but failed to log in.");
		}

		[HttpPost("RegisterManager")]
		public async Task<IActionResult> RegisterManager([FromBody] RegisterManagerViewModel model)
		{
			var manager = new Manager
			{
				UserName = model.UserName,
				Email = model.Email,
				Name = model.Name,
				Surname = model.Surname,
				Middlename = model.Middlename,
				PhoneNumber = model.PhoneNumber,
				Role = model.Role
			};

			var result = await _userManager.CreateAsync(manager, model.Password);

			if (!result.Succeeded) return BadRequest(result.Errors);
			if (!await _roleManager.RoleExistsAsync("Manager"))
				await _roleManager.CreateAsync(new IdentityRole<int> { Name = "Manager" });

			await _userManager.AddToRoleAsync(manager, "Manager");
			var signInResult = await _signInManager.PasswordSignInAsync(
	   manager.UserName,
	   model.Password,   
	   isPersistent: true, 
	   lockoutOnFailure: false 
   );
			if (signInResult.Succeeded)
			{
				return Ok(new
				{
					UserId = manager.Id,
					Role = "Manager"
				});
			}

			return BadRequest("Manager registered, but failed to log in.");
		}
		[HttpPost("Login")]
		public async Task<IActionResult> Login([FromBody] LoginViewModel model)
		{
			if (!ModelState.IsValid)
				return BadRequest("Invalid login data.");

			var user = await _userManager.FindByNameAsync(model.UserName);
			if (user == null)
				return Unauthorized("Invalid email or password.");

			var passwordValid = await _userManager.CheckPasswordAsync(user, model.Password);
			if (!passwordValid)
				return Unauthorized("Invalid username or password.");

			var roles = await _userManager.GetRolesAsync(user);

			var isManager = roles.Contains("Manager");


			return Ok(new
			{
				UserId = user.Id,
				IsManager = isManager,
				Roles = roles
			});
		}
		[HttpPost("Logout")]
		public async Task<IActionResult> Logout()
		{
			await _signInManager.SignOutAsync(); 
			return Ok();
		}
	}
}
