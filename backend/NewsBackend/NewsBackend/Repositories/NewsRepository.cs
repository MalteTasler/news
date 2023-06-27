//using Chayns.Auth.ApiExtensions;
//using Chayns.Auth.Shared;
using Dapper;
using Microsoft.Data.SqlClient;
using NewsBackend.Configuration;
using NewsBackend.Controllers;
using NewsBackend.Helpers;
using NewsBackend.Models;
using NewsBackend.Interfaces;

namespace NewsBackend.Repositories;

/// <inheritdoc />
public class NewsRepository : INewsRepository
{
    // Example table creation script:

    // ReSharper disable CommentTypo
    //
    // create table news
    // (
    // id                 serial
    //      constraint news_pk
    //          primary key,
    // title              varchar(256),
    // text               text                    not null,
    // site_id            varchar(20)             not null,
    // creation_person_id varchar(20)             not null,
    // publish_time       timestamp default now() not null
    // );

    // ReSharper restore CommentTypo

    private readonly ISqlConnectionProvider _connectionProvider;
    //private readonly ITokenInfoProvider _tokenInfoProvider;

    private readonly ILogger<NewsController> _logger;
    private readonly ConnectionString _connectionString;

    private readonly string _queryGetAllNews = 
        "SELECT * FROM viNewsEntries";
    private readonly string _queryGetMultipleNews = 
        "SELECT * FROM viNewsEntries WHERE PublishTime < @time";
    private readonly string _queryPostNewsEntry_AddImage = 
        "INSERT INTO Images (NewsEntryId, Url) VALUES (@NewsEntryId, @Image)";
    private readonly string _queryPostNewsEntry =
        "INSERT INTO NewsEntries (Title, Message, TappId, PublishTime, IsHidden, LastModificationTime) OUTPUT inserted.Id VALUES (@Headline, @Message, @TappId, @publishTime, @hidden, @lastModificationTime)";
    private readonly string _queryGetEntry =
        "SELECT * FROM viNewsEntries WHERE Id = @Id";
    private readonly string _queryDeleteEntry =
        "DELETE FROM NewsEntries WHERE Id = @Id";
    
    /// <summary>
    /// Creates new instance
    /// </summary>
    public NewsRepository(ISqlConnectionProvider connectionProvider/*, ITokenInfoProvider tokenInfoProvider*/)
    {
        _connectionProvider = connectionProvider;
        // _tokenInfoProvider = tokenInfoProvider;
    }

    /// <summary>
    /// Get a single entry by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<NewsEntry?> GetEntry(int id)
    {
        Console.WriteLine("GetEntry");
        using (var sqlCon =
               new SqlConnection(
                   "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
        {
            try
            {
                var response = await sqlCon.QueryFirstOrDefaultAsync<NewsEntryDBO>(_queryGetEntry, new { id });
                var parse = new NewsEntry();
                parse.Id = ""+response.Id;
                parse.Headline = response.Title;
                parse.Message = response.Message;
                // parse.TappId = response.TappId;
                parse.PublishTime = response.PublishTime;
                parse.hidden = response.IsHidden;
                parse.LastModificationTime = response.LastModificationTime;
                return parse;
            }
            catch (Exception ex)
            {
                //_logger.LogError("Reading rows in NewsEntries failed.", ex);
                throw ex;
            }
        }
    }

    /// <summary>
    /// Get all entries
    /// </summary>
    /// <returns></returns>
    public async Task<IEnumerable<NewsEntry>> GetAll(long tappId, bool adminMode)
    {
        Console.WriteLine("GetAll");
        using (var sqlCon =
               new SqlConnection(
                   "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
        {
            try
            {
                var response = await sqlCon.QueryAsync<NewsEntryDBO>(_queryGetAllNews, new { tappId });
                var parsed = new List<NewsEntry>();
                for(int i = 0; i < response.Count(); i++)
                {
                    var parse = new NewsEntry();
                    parse.Id = ""+response.ElementAt(i).Id;
                    parse.Headline = response.ElementAt(i).Title;
                    parse.Message = response.ElementAt(i).Message;
                    // parse.TappId = response.ElementAt(i).TappId;
                    parse.PublishTime = response.ElementAt(i).PublishTime;
                    parse.hidden = response.ElementAt(i).IsHidden;
                    parse.LastModificationTime = response.ElementAt(i).LastModificationTime;
                    parsed.Add(parse);
                }
                return parsed;
            }
            catch (Exception ex)
            {
                //_logger.LogError("Reading all rows in NewsEntries failed.", ex);
                throw ex;
            }
        }
    }

    public async Task<IEnumerable<NewsEntry>> GetMultiple(long tappId, bool adminMode, int count, long timestamp)
    {
        Console.WriteLine("GetMultiple");
        using (var sqlCon =
               new SqlConnection(
                   "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
        {
            var time = new DateTimeOffset();
            try
            {
                time = DateTimeOffset.FromUnixTimeMilliseconds(timestamp);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            try
            {
                var response = await sqlCon.QueryAsync<Models.NewsEntryDBO>(_queryGetMultipleNews, new { tappId, count, time });
                var parsed = new List<NewsEntry>();
                for(int i = 0; i < response.Count(); i++)
                {
                    var parse = new NewsEntry();
                    parse.Id = ""+response.ElementAt(i).Id;
                    parse.Headline = response.ElementAt(i).Title;
                    parse.Message = response.ElementAt(i).Message;
                    // parse.TappId = response.ElementAt(i).TappId;
                    parse.PublishTime = response.ElementAt(i).PublishTime;
                    parse.hidden = response.ElementAt(i).IsHidden;
                    parse.LastModificationTime = response.ElementAt(i).LastModificationTime;
                    parsed.Add(parse);
                }
                return parsed;
            }
            catch (Exception ex)
            {
                //_logger.LogError("Reading all rows in NewsEntries failed.", ex);
                throw ex;
            }
        }
    }

    /// <summary>
    /// Create a new entry
    /// </summary>
    /// <param name="entry"></param>
    /// <returns>The id of the new created entry</returns>
    public async Task<int> Create(NewsEntry newsEntry)
    {
        Console.WriteLine("Create");
        /*if (_tokenInfoProvider.GetPayloadSubject() is not LocationUserTokenPayload tokenInfo)
            throw new Exception("Operation is not permitted");*/

        using (var sqlCon =
               new SqlConnection(
                   "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
        {
            try
            {
                List<string> imageList = newsEntry.ImageList;
                var response = await sqlCon.ExecuteAsync(_queryPostNewsEntry,
                    new
                    {
                        Headline = newsEntry.Headline, Message = newsEntry.Message, TappId = 1,
                        publishTime = newsEntry.PublishTime, hidden = newsEntry.hidden,
                        lastModificationTime = DateTime.Now
                    }
                );
                Console.WriteLine(response);
                /*foreach (var s in imageList)
                {
                    await sqlCon.ExecuteAsync(_queryPostNewsEntry_AddImage, new { NewsEntryId = 1, Image = s });
                }*/
                return 0;
            }
            catch (Exception ex)
            {
                //_logger.LogError("Inserting row in NewsEntries failed.", ex);
                throw ex;
            }
        }
    }

    public async Task<int> Update(NewsEntry newsEntry)
    {
        Console.WriteLine("Create");
        using (var sqlCon =
               new SqlConnection(
                   "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
        {
            try
            {
                List<string> imageList = newsEntry.ImageList;
                var response = await sqlCon.ExecuteAsync(_queryPostNewsEntry,
                    new
                    {
                        Headline = newsEntry.Headline, Message = newsEntry.Message, TappId = 1,
                        publishTime = newsEntry.PublishTime, hidden = newsEntry.hidden,
                        lastModificationTime = DateTime.Now
                    }
                );
                Console.WriteLine(response);
                /*foreach (var s in imageList)
                {
                    await sqlCon.ExecuteAsync(_queryPostNewsEntry_AddImage, new { NewsEntryId = 1, Image = s });
                }*/
                return 0;
            }
            catch (Exception ex)
            {
                //_logger.LogError("Inserting row in NewsEntries failed.", ex);
                throw ex;
            }
        }
    }

    public async Task<int> Patch(NewsEntry newsEntry)
    {
        Console.WriteLine("Create");
        using (var sqlCon =
               new SqlConnection(
                   "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true"))
        {
            try
            {
                List<string> imageList = newsEntry.ImageList;
                var response = await sqlCon.ExecuteAsync(_queryPostNewsEntry,
                    new
                    {
                        Headline = newsEntry.Headline, Message = newsEntry.Message, TappId = 1,
                        publishTime = newsEntry.PublishTime, hidden = newsEntry.hidden,
                        lastModificationTime = DateTime.Now
                    }
                );
                Console.WriteLine(response);
                /*foreach (var s in imageList)
                {
                    await sqlCon.ExecuteAsync(_queryPostNewsEntry_AddImage, new { NewsEntryId = 1, Image = s });
                }*/
                return 0;
            }
            catch (Exception ex)
            {
                //_logger.LogError("Inserting row in NewsEntries failed.", ex);
                throw ex;
            }
        }
    }
    
    /// <summary>
    /// Delete an entry by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<int> Delete(int id)
    {
        Console.WriteLine("Delete");
        /*if (_tokenInfoProvider.GetPayloadSubject() is not LocationUserTokenPayload tokenInfo)
            throw new Exception("Operation is not permitted");*/
        return 0;
    }
}