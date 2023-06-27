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
    /// Get multiple entries for a specific tapp, timespan and of a specific amount
    /// </summary>
    /// <param name="tappId"></param>
    /// <returns></returns>
    Task<IEnumerable<NewsEntry>> GetMultiple(long tappId, bool adminMode, int count, long timestamp);
    
    /// <summary>
    /// Get all entries for a specific tapp
    /// </summary>
    /// <param name="tappId"></param>
    /// <returns></returns>
    Task<IEnumerable<NewsEntry>> GetAll(long tappId, bool adminMode);

    /// <summary>
    /// Create a new entry
    /// </summary>
    /// <param name="entry"></param>
    /// <returns>The id of the new created entry</returns>
    Task<int> Create(NewsEntry entry);

    Task<int> Update(NewsEntry entry);
    
    Task<int> Patch(NewsEntry entry);
    
    /// <summary>
    /// Delete an entry by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<int> Delete(int id);
}