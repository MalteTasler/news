import React from 'react';
import { AnimationWrapper, Button } from 'chayns-components'
import NewsList from './NewsList';
import AddNewsEntry from './AddNewsEntry'
import styles from "./App.module.css"

const App = () => {
    const fetchURL = "https://mashup.tobit.com/api/news/v3.0/newsvstring/1";
    const count = 1;
    const now = new Date();

    const [news, setNews] = React.useState([])

    async function laodMore() {
        await fetchNews(true);
    }
    function getTimestampOfOldestLoadedNewsEntry() {
        if(news.length <= 1) { // if no news entries are loaded yet, just use the current timestamp (timestamp when the page was loaded)
            return now.getTime();
        }
        //  if entries are already loaded take the timestamp of the oldest
        const oldestLoadedNewsEntry = news[news.length-1];
        const timestamp = oldestLoadedNewsEntry.publishTimestamp;
        return timestamp;
    }
    async function fetchNews(offset = false) {  // if offset is true, last value of current news array gets popped
        // generate fetchURL with parameters
        let fetchURLWithParameters = `${fetchURL}?`
        fetchURLWithParameters += `timestamp=${getTimestampOfOldestLoadedNewsEntry()}&count=${count}&past=true&categoryId=0&locationOnly=false&TappID=91958&noCache=false`;

        // try to load news entries
        console.log(`try fetch news entries with the URL with parameters:" ${fetchURLWithParameters}"...`);
        const response = await fetch(fetchURLWithParameters)
        const parsedResponse = await response.json();
        const itemList = parsedResponse.itemList;
        setNews(prevState => {
            if (offset)
                prevState.pop()
            return (prevState.concat(itemList))
        })
        console.log(`fetched ${count} news entries: `, news);
    }
    function publish() {
        console.log("new entry")
    }
    React.useEffect(() => {
        const getItems = async() => {
            await fetchNews(false)
        }
        getItems()
    }, [])
    return (
        <div>
            <AnimationWrapper>
                <h1 id = "pageHeadline">Aktuelle News aus dem BamBoo!</h1>
                <p id = "pageSubHeadline">Kurz, kompakt und immer wieder frisch informieren wir hier über aktuelle Themen und Aktionen.</p>
                <AddNewsEntry onPublish = {publish} />
            </AnimationWrapper>
                {news.length > 0 ? <NewsList news = {news} now = {now}/> : "loading..."}
                <div className={styles.btContainer}>
                    <Button id={styles.btLoadMore} onClick={laodMore}>Mehr</Button>
                </div>
        </div>
    )
}
export default App;