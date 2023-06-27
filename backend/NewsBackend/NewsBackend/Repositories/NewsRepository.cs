//using Chayns.Auth.ApiExtensions;
//using Chayns.Auth.Shared;
using Dapper;
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
        const string query = "SELECT * FROM news WHERE id = @id";

        using var cn = await _connectionProvider.GetConnection();
        return await cn.QueryFirstOrDefaultAsync<NewsEntry>(query, new {id});
    }

    /// <summary>
    /// Get all entries
    /// </summary>
    /// <returns></returns>
    public async Task<IEnumerable<NewsEntry>> GetAll(string siteId)
    {
        // TODO: This is a very basic example. You should never select all entries from a table without skip & take or any other filter

        const string query = "SELECT * FROM news WHERE site_id = @siteId";

        using var cn = await _connectionProvider.GetConnection();
        return await cn.QueryAsync<NewsEntry>(query, new {siteId});
    }

    /// <summary>
    /// Create a new entry
    /// </summary>
    /// <param name="entry"></param>
    /// <returns>The id of the new created entry</returns>
    public async Task<int> Create(NewsEntry entry)
    {
        /*if (_tokenInfoProvider.GetPayloadSubject() is not LocationUserTokenPayload tokenInfo)
            throw new Exception("Operation is not permitted");*/

        const string query = "INSERT INTO news (title, text, publish_time, site_id, creation_person_id) OUTPUT inserted.Id VALUES (@title, @text, @publishTime, @siteId, @personId)";

        using var cn = await _connectionProvider.GetConnection();

        return await cn.ExecuteScalarAsync<int>(query, new
        {
            entry.Headline,
            entry.Message,
            PublishTime = entry.publishTime != default ? entry.publishTime : DateTime.UtcNow/*,
            tokenInfo.SiteId,
            tokenInfo.PersonId*/
        });
    }

    /// <summary>
    /// Delete an entry by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<int> Delete(int id)
    {
        // Delete by id AND siteId to avoid deleting news from other pages
        const string query = "DELETE FROM news WHERE id = @id AND site_id = @siteId";

        /*if (_tokenInfoProvider.GetPayloadSubject() is not LocationUserTokenPayload tokenInfo)
            throw new Exception("Operation is not permitted");*/

        using var cn = await _connectionProvider.GetConnection();
        return await cn.ExecuteAsync(query, new {id/*, tokenInfo.SiteId*/});
    }
}