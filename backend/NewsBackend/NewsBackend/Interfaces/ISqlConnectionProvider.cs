using System.Data;

namespace NewsBackend.Helpers;

/// <summary>
/// Provides sql connections
/// </summary>
public interface ISqlConnectionProvider
{
    /// <summary>
    /// Creates a new connection with the given name
    /// </summary>
    /// <param name="connectionName">The name of the connection string. Defaults to "default"</param>
    /// <returns>Ready to use connection</returns>
    /// <exception cref="ArgumentException"></exception>
    Task<IDbConnection> GetConnection(string? connectionName = null);
}