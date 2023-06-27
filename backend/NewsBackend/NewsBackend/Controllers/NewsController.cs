using System.Web.Http.Cors;
using Dapper;
// using Chayns.Auth.ApiExtensions;
// using Chayns.Auth.Shared.Constants;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using NewsBackend.Configuration;
using NewsBackend.Models;

namespace NewsBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://w-mtasler-l:1234", headers: "*", methods: "*")]
    public class NewsController : ControllerBase
    {
        private readonly ILogger<NewsController> _logger;
        private readonly ConnectionString _connectionString;

        private readonly string _queryGetAllNews = "SELECT * FROM viNewsEntries";

        private readonly string _queryPostNewsEntry_AddImage = 
            "INSERT INTO Images (NewsEntryId, Url) VALUES (@NewsEntryId, @Image)";
        private readonly string _queryPostNewsEntry =
            "INSERT INTO NewsEntries (Title, Message, TappId, PublishTime, IsHidden, LastModificationTime) VALUES (@Headline, @Message, @TappId, @publishTime, @hidden, @lastModificationTime)";

        public NewsController(ILogger<NewsController> logger, IOptions<ConnectionString> connectionString)
        {
            _logger = logger;
            _logger.LogInformation("Application is setting up");
            _connectionString = connectionString.Value;
        }

        [HttpGet(Name = "GetMultipleNews")]
        public async Task<IActionResult> GetMultipleNews(bool adminMode = true, int count = 1000, string timestamp = null)
        {
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;User ID=ApplicationASP.NETDebug;Password=Tobit913
            // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true
            using (var sqlCon = new SqlConnection("Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
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
            using (var sqlCon = new SqlConnection("Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
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
        public async Task<IActionResult> PostNewsEntry([FromBody] NewsEntry newsEntry)
        {
            using (var sqlCon =
                   new SqlConnection(
                       "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
            {
                try
                {
                    Console.WriteLine("post with body " + newsEntry.publishTime + newsEntry.publishTimestamp + newsEntry.hidden + newsEntry.Headline + newsEntry.Message + newsEntry.ImageList);
                    var response = await sqlCon.ExecuteAsync(_queryPostNewsEntry, new { Headline = newsEntry.Headline, Message = newsEntry.Message, TappId = 1, publishTime = newsEntry.publishTime, hidden = newsEntry.hidden, lastModificationTime = DateTime.Now });
                    Console.WriteLine(response);
                    List<string> imageList = newsEntry.ImageList;
                    /*foreach (var s in imageList)
                    {
                        await sqlCon.ExecuteAsync(_queryPostNewsEntry_AddImage, new { NewsEntryId = 1, Image = s });
                    }*/
                    return Ok("Post Ok");
                }
                catch (Exception ex)
                {
                    _logger.LogError("Reading rows in NewsEntries failed.", ex);
                    throw ex;
                }
            }
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