using System.Net;
using System.Web.Http.Cors;
using Dapper;
// using Chayns.Auth.ApiExtensions;
// using Chayns.Auth.Shared.Constants;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using NewsBackend.Configuration;
using NewsBackend.Helpers.Extensions;
using NewsBackend.Repositories;
using NewsBackend.Interfaces;
using NewsBackend.Models;

namespace NewsBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://w-mtasler-l:1234", headers: "*", methods: "*")]
    public class NewsController : Controller
    {
        private readonly INewsRepository _newsRepository;
        private readonly IHttpContextAccessor _contextAccessor;

        public NewsController(INewsRepository newsRepository/*, IHttpContextAccessor contextAccessor*/)
        {
            _newsRepository = newsRepository;
            // _contextAccessor = contextAccessor;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMultipleNews(string id, bool adminMode = true)
        {
            Console.WriteLine("get with parameter "+ id + "adminMode currently " + (adminMode ? "enabled" : "disabled"));
            return Ok("Ok "+id);
        }
        
        [HttpGet(Name = "GetMultipleNews")]
        public async Task<IActionResult> GetMultipleNews(long tappId, bool adminMode = true, int count = 1000, long timestamp = 0)
        {
            var newsEntries = new List<NewsEntry>();
            if (timestamp == 0)
            {
                newsEntries = (await _newsRepository.GetAll(tappId, adminMode)).ToList();
            }
            else
            {
                newsEntries = (await _newsRepository.GetMultiple(tappId, adminMode, count, timestamp)).ToList();
            }
            Console.WriteLine("got from repository: "+newsEntries.Count);
            if (newsEntries.Count == 0) 
                return NoContent();
            var response = new GetAllResponse(newsEntries);
            Console.WriteLine("adminMode currently " + (adminMode ? "enabled" : "disabled"));
            return Ok(response);
        }
        
        [HttpPost(Name = "PostNewsEntry")]
        public async Task<IActionResult> PostNewsEntry([FromBody] NewsEntry newsEntry)
        {
            Console.WriteLine("post with body " + newsEntry.PublishTime + newsEntry.PublishTimestamp + newsEntry.hidden + newsEntry.Headline + newsEntry.Message + newsEntry.ImageList);
            await _newsRepository.Create(newsEntry);
            return Ok("Post Ok");
        }
        
        [HttpPut("{id}", Name = "PutNewsEntry")]
        public async Task<IActionResult> PutNewsEntry(int id, [FromBody] NewsEntry newsEntry)
        {
            Console.WriteLine("put with id " + id + " and body " + newsEntry);
            await _newsRepository.Update(newsEntry);
            return Ok("Put Ok");
        }
        [HttpPatch("{id}/{prop}", Name = "PatchNewsEntry")]
        public async Task<IActionResult> PatchNewsEntry(int id, string prop, [FromBody] NewsEntry newsEntry)
        {
            Console.WriteLine("post with id " + id + " and prop " + prop + " and body" + newsEntry);
            await _newsRepository.Patch(newsEntry);
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