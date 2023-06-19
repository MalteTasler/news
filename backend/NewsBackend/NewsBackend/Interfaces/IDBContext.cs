using System.Data;
using System.Threading.Tasks;

namespace NewsBackend.Interfaces
{
    public interface IDBContext
    {
        Task<IDbConnection> GetDBContext();
    }
}