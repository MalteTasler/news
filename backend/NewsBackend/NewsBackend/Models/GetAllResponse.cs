namespace NewsBackend.Models;

public class GetAllResponse
{
    public GetAllResponse(List<NewsEntry> itemList)
    {
        this.itemList = itemList;
        length = itemList.Count;
    }
    public List<NewsEntry> itemList { get; set; }
    public int length { get; set; }
}