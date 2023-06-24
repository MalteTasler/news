using NewsBackend.Interfaces;
using Dapper;

namespace NewsBackend.Repositories
{
    public class NewsRepository : INewsRepository
    {
        private readonly IDBContext _dbContext;
        private readonly ILogger _logger;

        private readonly string query_getAllNews = "SELECT * FROM viNewsEntries";
        public NewsRepository(IDBContext dbContext, ILogger<NewsRepository> logger) {
            _dbContext = dbContext;
            _logger = logger;
            _logger.LogInformation("Application is setting up.");
        }
        public async Task<List<Models.NewsEntry>> GetAllNews()
        {
            using (var sqlCon = await _dbContext.GetDBContext())
            {
                try
                {
                    var newsEntries = (await sqlCon.QueryAsync<Models.NewsEntry>(query_getAllNews)).ToList();
                    return newsEntries;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Reading all rows in Location failed.", ex);
                    throw ex;
                }
            }
        }
    }
}