import React from 'react';
import { Button } from 'chayns-components'
import NewsList from './NewsList';
import styles from "./App.module.css"

const App = () => {
    const [news, setNews] = React.useState([])
    const fetchURL = "https://mashup.tobit.com/api/news/v3.0/newsvstring/1";
    const count = 10;
    const now = new Date();
    function laodMore() {
        console.log("clicked load button")
        fetchNews(true);
    }
    function getTimestampOfOldestLoadedNewsEntry() {
        if(news.length <= 1) { // if no news entries are loaded yet, just use the current timestamp (timestamp when the page was loaded)
            return now.getTime();
        }
        
        //  if entries are already loaded take the timestamp of the oldest
        const oldestLoadedNewsEntry = news[news.length-1];
        //  console.log("oldest loaded news entry: ", news.itemList.length - 1, oldestLoadedNewsEntry);
        const timestamp = oldestLoadedNewsEntry.publishTimestamp;
        //  console.log("timestamp of oldest loaded news entry: ", timestamp);
        return timestamp;
    }
    async function fetchNews(offset = false) {
        
        // generate fetchURL with parameters

        let fetchURLWithParameters = `${fetchURL}?`
        fetchURLWithParameters += `timestamp=${getTimestampOfOldestLoadedNewsEntry()}&count=${count}&past=true&categoryId=0&locationOnly=false&TappID=91958&noCache=false`;

        // try to load news entries
        
        console.log(`try fetch news entries with the URL with parameters:" ${fetchURLWithParameters}"...`);
        const response = await fetch(fetchURLWithParameters)
        const parsedResponse = await response.json();
        const itemList = parsedResponse.itemList;
        console.log("list ", itemList)
        setNews(prevState => {
            console.log("previous one ", prevState, "new one ", [...prevState, itemList])
            if (offset)
                prevState.pop()
            return (prevState.concat(itemList))
        })
        console.log(`fetched ${count} news entries: `, news);
    }
    React.useEffect(() => {
        console.log("get the news!")
        const getItems = async() => {
            await fetchNews(false)
        }
        getItems()
    }, [])
    return (
        <div>
            <h1 id = "pageHeadline">Aktuelle News aus dem BamBoo!</h1>
            <p id = "pageSubHeadline">Kurz, kompakt und immer wieder frisch informieren wir hier über aktuelle Themen und Aktionen.</p>
            {news.length > 9 ? <NewsList news={news} now = {now}/> : "loading..."}
            <div className={styles.btContainer}>
                <Button id={styles.btLoadMore} onClick={laodMore}>Mehr</Button>
            </div>
        </div>
    )
}
export default App;
