using Microsoft.AspNetCore.Mvc;

namespace NewsBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewsController : ControllerBase
    {

        private readonly ILogger<WeatherForecastController> _logger;

        public NewsController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetAllNews")]
        public IActionResult GetAllNews()
        {
            List<Models.NewsEntry> news = new List<Models.NewsEntry>();
            try
            {
                news = new List<Models.NewsEntry>();
                news.Add(new Models.NewsEntry());
                news[0].Title = "this";
            }
            catch (Exception ex)
            {
                return Conflict(ex);
            }
            if (news.Count == 0) return NoContent();
            return Ok(news);
        }
    }
}