using NewsBackend.Configuration;
using NewsBackend.Helpers;
using NewsBackend.Interfaces;
using NewsBackend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(x =>
{
    x.AddPolicy("AllowAll", y =>
    {
        y.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

// builder.Services.Configure<ConnectionString>(Configuration.GetSection("ConnectionString"));

// Add helpers
builder.Services.AddSingleton<ISqlConnectionProvider, SqlConnectionProvider>();

// Add repositories
// Repositories should be stateless in general. Add as singleton if not explicitly needed otherwise
builder.Services.AddSingleton<INewsRepository, NewsRepository>();


/*// The tobit web client factory will register a ITobit
builder.Services.AddTobitWebClientHandling();*/

/*// Add chayns authentication
builder.Services.AddChaynsAuth();*/

/*// Add global error handling
builder.Services.AddChaynsErrorHandling();*/

/*// Add swagger docs
builder.Services.AddSwagger(Configuration);*/

/*builder.Services.AddRouting(o =>
{
    // Enable the "{paramName:siteId}" route filter
    // If the paramName does not match, the route will not resolve
    o.ConstraintMap.Add("siteId", typeof(SiteIdRouteConstraint));
});*/

/*builder.Services.AddTobitHealthChecks()
    .AddTobitPostgres(Configuration.GetConnectionString("default"));*/


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    /*app.UseSwagger();
    app.UseSwaggerUI();*/
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// app.UseRouting();

// app.UseCustomSwagger();

// app.InitChaynsAuth();

// Add response to options before request logging
// to skip logging for this requests
// app.UseRespondToOptions();

// Add request logging
// This will create a request log for every request
// and also catch and log all unhandled exceptions
// app.UseRequestLogging();

// Will catch and handle all ChaynsExceptions
// It is important to add this after RequestLogging in the request chain
// Otherwise RequestLogging would handle all errors
// app.UseChaynsErrorHandling();

/*app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    // Use health check endpoint. Endpoint defaults to "/_health"
    // See https://gitlab.tobit.com/Libraries/tobit.healthcheck for more info about health checks
    endpoints.MapTobitHealthChecks();
});*/

app.Run();