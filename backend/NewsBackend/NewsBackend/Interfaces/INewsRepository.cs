using NewsBackend.Models;

namespace NewsBackend.Interfaces;

/// <summary>
/// Provide methods to handle news
/// </summary>
public interface INewsRepository
{
    /// <summary>
    /// Get a single entry by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<NewsEntry?> GetEntry(int id);

    /// <summary>
    /// Get all entries for a specific site
    /// </summary>
    /// <param name="siteId"></param>
    /// <returns></returns>
    Task<IEnumerable<NewsEntry>> GetAll(string siteId);

    /// <summary>
    /// Create a new entry
    /// </summary>
    /// <param name="entry"></param>
    /// <returns>The id of the new created entry</returns>
    Task<int> Create(NewsEntry entry);

    /// <summary>
    /// Delete an entry by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<int> Delete(int id);
}