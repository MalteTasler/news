import React from 'react';
import NewsList from './NewsList';

const App = () => {
    const [news, setNews] = React.useState([{}])
    const fetchURL = "https://mashup.tobit.com/api/news/v3.0/newsvstring/1";
    const count = 10;
    const now = new Date();
    function getTimestampOfOldestLoadedNewsEntry() {
        if(news === undefined) { // if no news entries are loaded yet, just use the current timestamp (timestamp when the page was loaded)
            return now.getTime();
        }
        return now.getTime();
        /* if entries are already loaded take the timestamp of the oldest
        const oldestLoadedNewsEntry = news.itemList[news.itemList.length-1];
        //console.log("oldest loaded news entry: ", news.itemList.length - 1, oldestLoadedNewsEntry);
        let timestamp = oldestLoadedNewsEntry.publishTimestamp;
        //console.log("timestamp of oldest loaded news entry: ", timestamp);
        return timestamp;

        setNews([{title: "Hi", message: "That is a message", images: ["abc", "that is a"], id:"asd"}])
        */
    }
    React.useEffect(() => {
        console.log("get the news!")

        // generate fetchURL with parameters
        let fetchURLWithParameters = `${fetchURL}?`
        fetchURLWithParameters += `timestamp=${getTimestampOfOldestLoadedNewsEntry()}&count=${count}&past=true&categoryId=0&locationOnly=false&TappID=91958&noCache=false`;

        // try to load news entries
        
        console.log(`try fetch news entries with the URL with parameters:" ${fetchURLWithParameters}"...`);
        const getNews = async () => {
            const response = await fetch(fetchURLWithParameters)
            const parsedResponse = await response.json();
            const itemList = parsedResponse.itemList;
            setNews(itemList)
        }
        getNews()
        console.log(`fetched ${count} news entries: `, news);
    }, [])
    return (
        <div>
            <h1 id = "pageHeadline">Aktuelle News aus dem BamBoo!</h1>
            <p id = "pageSubHeadline">Kurz, kompakt und immer wieder frisch informieren wir hier über aktuelle Themen und Aktionen.</p>
            {news.length > 9 ? <NewsList news={news} now = {now}/> : "loading..."}
        </div>
    )
}
export default App;
