namespace NewsBackend.Models;

public class NewsEntryDBO
{
    public int Id { get; set; }
    public long TappId { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public bool IsHidden { get; set; }
    public DateTime? LastModificationTime { get; set; }
    public DateTime PublishTime { get; set; }
}