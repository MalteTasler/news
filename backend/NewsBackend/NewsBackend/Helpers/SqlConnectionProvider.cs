using System.Collections.Concurrent;
using System.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace NewsBackend.Helpers;

/// <summary>
/// Helper class to provide sql connections
/// </summary>
public class SqlConnectionProvider : ISqlConnectionProvider
{
    private readonly ILogger<SqlConnectionProvider> _logger;
    private readonly IConfiguration _configuration;
    private readonly ConcurrentDictionary<string, string> _connectionStrings = new();

    private const string DefaultConnectionName = "default";
    private const string DefaultPasswordPlaceHolder = "##db_password##";
    private const string DefaultPasswordEnvironmentVariableName = "DbPassword";

    /// <summary>
    /// Creates new instance
    /// </summary>
    public SqlConnectionProvider(ILogger<SqlConnectionProvider> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    /// <summary>
    /// Creates a new connection with the given name
    /// </summary>
    /// <param name="connectionName">The name of the connection string. Defaults to "default"</param>
    /// <returns>Ready to use connection</returns>
    /// <exception cref="ArgumentException"></exception>
    public async Task<IDbConnection> GetConnection(string? connectionName = null)
    {
        connectionName ??= DefaultConnectionName;

        var connectionString = _connectionStrings.GetOrAdd(connectionName, GetConnectionString);
        var connection = new NpgsqlConnection(connectionString);

        await connection.OpenAsync();
        return connection;
    }

    private string GetConnectionString(string connectionName)
    {
        var connectionString = _configuration.GetConnectionString(connectionName);

        if (string.IsNullOrEmpty(connectionString))
            throw new ArgumentException($"ConnectionString '{connectionName}' was not found.");

        // Replace password with environment variable
        if (!connectionString.Contains(DefaultPasswordPlaceHolder))
            return connectionString;
        
        var password = Environment.GetEnvironmentVariable(DefaultPasswordEnvironmentVariableName);
        if (password != null)
            return connectionString.Replace(DefaultPasswordPlaceHolder, password);
        
        _logger.LogError("Placeholder {Placeholder} was found in connection string. You should set '{EnvName}' or configure your CI pipeline to set password", DefaultPasswordPlaceHolder,
            DefaultPasswordEnvironmentVariableName);
        
        return connectionString;
    }
}