namespace NewsBackend.Models
{
    public class NewsEntry
    {
        public string? Headline { get; set; }
        public string? Message { get; set; }
        public List<string> ImageList { get; set; }
        public DateTime publishTime { get; set; }
        public int publishTimestamp { get; set; }
        public bool hidden { get; set; }
    }
}