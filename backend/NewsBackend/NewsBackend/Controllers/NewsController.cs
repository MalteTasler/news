using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using NewsBackend.Interfaces;

namespace NewsBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NewsController : ControllerBase
    {

        private readonly ILogger<NewsController> _logger;
        private readonly INewsRepository _NewsReposiory;
        private readonly IDBContext _dbContext;

        private readonly string query_getAllNews = "SELECT * FROM viNewsEntries";

        public NewsController(ILogger<NewsController> logger)
        {
            _logger = logger;
            _logger.LogInformation("Application is setting up.");
        }

        [HttpGet(Name = "GetAllNews")]
        public async Task<IActionResult> GetAllNews()
        {
            List<Models.NewsEntry> news = new List<Models.NewsEntry>();
            news = new List<Models.NewsEntry>();
            //news = await _NewsReposiory.GetAllNews();
            //news.Add(new Models.NewsEntry());
            //news[0].Title = "this";
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;User ID=ApplicationASP.NETDebug;Password=Tobit913
            using (var sqlCon = new SqlConnection("Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true")
                /*await _dbContext.GetDBContext()*/)
            {
                try
                {
                    var newsEntries = (await sqlCon.QueryAsync<Models.NewsEntry>(query_getAllNews)).ToList();
                    return Ok(newsEntries);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Reading all rows in Location failed.", ex);
                    throw ex;
                }
            }
            if (news.Count == 0) return NoContent();
            return Ok(news);
        }
        [HttpPost(Name = "PostNewsEntry")]
        public IActionResult PostNewsEntry()
        {
            return Ok("Post Ok");
        }
        [HttpPut(Name = "PutNewsEntry")]
        public IActionResult PutNewsEntry()
        {
            return Ok("Put Ok");
        }
        [HttpPatch(Name = "PatchNewsEntry")]
        public IActionResult PatchNewsEntry()
        {
            return Ok("Patch Ok");
        }
        [HttpDelete(Name = "DeleteAllNews")]
        public IActionResult DeleteAllNews()
        {
            return Ok("Deletion of all news Ok");
        }
    }
}