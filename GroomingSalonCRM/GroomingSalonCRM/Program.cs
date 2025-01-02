using GroomingSalonCRM.Data;
using GroomingSalonCRM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using System.Net;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ApplicationDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Налаштування Identity для Client та Manager
builder.Services.AddIdentity<IdentityUser<int>, IdentityRole<int>>(options =>
{
	options.Password.RequireDigit = true;
	options.Password.RequireLowercase = true;
	options.Password.RequireNonAlphanumeric = false;
	options.Password.RequireUppercase = true;
	options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();



builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll",
		   builder => builder.AllowAnyOrigin()
							 .AllowAnyMethod()
							 .AllowAnyHeader());
});
// Додати контролери
builder.Services.AddControllers();

// Налаштування Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
async Task CreateRoles(IServiceProvider serviceProvider)
{
	var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

	var roles = new[] { "Manager", "Client" };

	foreach (var role in roles)
	{
		if (!await roleManager.RoleExistsAsync(role))
		{
			await roleManager.CreateAsync(new IdentityRole<int> { Name = role });
		}
	}
}

var app = builder.Build();
app.UseCors("AllowAll");

using (var scope = app.Services.CreateScope())
{
	var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
	dbContext.Database.Migrate();
	var services = scope.ServiceProvider;
	await CreateRoles(services);
}
// Використання Swagger для документації API
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

// Налаштування HTTPS та маршрутизації
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication(); // Додаємо аутентифікацію
app.UseAuthorization();
app.UseCors();
app.MapControllers();
app.UseStaticFiles();

app.Run();