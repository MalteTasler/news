namespace NewsBackend.Models
{
    public class NewsEntry
    {
        public string? Id { get; set; }
        // public long TappId { get; set; }
        public string? Headline { get; set; }
        public string? Message { get; set; }
        public List<string>? ImageList { get; set; }
        public DateTime PublishTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
        public long PublishTimestamp { get; set; }
        public bool hidden { get; set; }
    }
}