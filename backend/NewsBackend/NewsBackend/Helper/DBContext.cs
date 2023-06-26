using System.Data;
using Microsoft.Extensions.Options;
using NewsBackend.Interfaces;
using Microsoft.Data.SqlClient;
using NewsBackend.Models;
//using Microsoft.EntityFrameworkCore;


namespace NewsBackend.Helper
{
    public class DBContext : IDBContext
    {
        //private const string ConnectionString = "Data Source=tappqa.tobit.ag;Initial Catalog=20Training-Server-MT;Integrated Security=True;Application Name=MTServer";
        // Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true
        private const string ConnectionString = "Data Source=W-MTASLER-L;Initial Catalog=News;Integrated Security=True;TrustServerCertificate=true";
        private readonly DBSetting _dbSettings;

        public DBContext(IOptions<DBSetting> dbSettings)
        {
            _dbSettings = dbSettings.Value;
            _dbSettings.ConnectionString = ConnectionString;
        }
        public async Task<IDbConnection> GetDBContext()
        {
            try
            {
                var con = new SqlConnection(_dbSettings.ConnectionString);
                await con.OpenAsync();
                return con;
            }
            catch (Exception ex)
            {
                //_logger.LogError("sql database not reached.", ex);
                Console.WriteLine("SqlBulkCopy databse not reached", ex);
                throw ex;
            }
        }
    }
}