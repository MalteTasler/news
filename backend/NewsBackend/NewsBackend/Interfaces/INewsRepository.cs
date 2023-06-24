namespace NewsBackend.Interfaces
{
    public interface INewsRepository
    {
        Task<List<Models.NewsEntry>> GetAllNews();
    }
}