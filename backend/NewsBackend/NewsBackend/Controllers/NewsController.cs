using System.Web.Http.Cors;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Constraints;
using Microsoft.Data.SqlClient;
using NewsBackend.Interfaces;
using NewsBackend.Models;

namespace NewsBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://w-mtasler-l:1234", headers: "*", methods: "*")]
    public class NewsController : ControllerBase
    {
        private readonly ILogger<NewsController> _logger;
        private readonly IDBContext _dbContext;

        private readonly string _queryGetAllNews = "SELECT * FROM viNewsEntries";

        public NewsController(ILogger<NewsController> logger)
        {
            _logger = logger;
            _logger.LogInformation("Application is setting up");
        }

        [HttpGet(Name = "GetMultipleNews")]
        public async Task<IActionResult> GetMultipleNews(bool adminMode = true, int count = 1000, string timestamp = null)
        {
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;User ID=ApplicationASP.NETDebug;Password=Tobit913
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true
            using (var sqlCon = new SqlConnection("Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true")/*await _dbContext.GetDBContext()*/)
            {
                try
                {
                    var newsEntries = (await sqlCon.QueryAsync<Models.NewsEntry>(_queryGetAllNews)).ToList();
                    if (newsEntries.Count == 0) return NoContent();
                    var response = new GetAllResponse(newsEntries);
                    Console.WriteLine("adminMode currently " + (adminMode ? "enabled" : "disabled"));
                    return Ok(response);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Reading all rows in NewsEntries failed.", ex);
                    throw ex;
                }
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMultipleNews(string id, bool adminMode = true)
        {
            using (var sqlCon = new SqlConnection("Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true")/*await _dbContext.GetDBContext()*/)
            {
                try
                {
                    Console.WriteLine("get with parameter "+ id + "adminMode currently " + (adminMode ? "enabled" : "disabled"));
                    return Ok("Ok "+id);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Reading rows in NewsEntries failed.", ex);
                    throw ex;
                }
            }
        }
        [HttpPost(Name = "PostNewsEntry")]
        public IActionResult PostNewsEntry([FromBody] NewsEntry newsEntry)
        {
            Console.WriteLine("post with body " + newsEntry);
            return Ok("Post Ok");
        }
        [HttpPut("{id}", Name = "PutNewsEntry")]
        public IActionResult PutNewsEntry(int id, [FromBody] NewsEntry newsEntry)
        {
            Console.WriteLine("put with id " + id + " and body " + newsEntry);
            return Ok("Put Ok");
        }
        [HttpPatch("{id}/{prop}", Name = "PatchNewsEntry")]
        public IActionResult PatchNewsEntry(int id, string prop, [FromBody] NewsEntry newsEntry)
        {
            Console.WriteLine("post with id " + id + " and prop " + prop + " and body" + newsEntry);
            return Ok("Patch Ok");
        }
        [HttpDelete("{id}", Name = "DeleteNewsEntry")]
        public IActionResult DeleteNewsEntry(int id)
        {
            Console.WriteLine("Deletion of news entry with that id " + id + " Ok");
            return Ok("Deletion of news entry with that id " + id + " Ok");
        }
        [HttpDelete(Name = "DeleteAllNews")]
        public IActionResult DeleteAllNews()
        {
            return Ok("Deletion of all news Ok");
        }
    }
}