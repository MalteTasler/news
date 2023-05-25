import React, { useEffect, useState } from 'react'
import { AnimationWrapper, Button, Checkbox } from 'chayns-components'
import NewsList from './NewsList'
import AddNewsEntry from './AddNewsEntry'
import styles from './App.module.css'

const App = () => {
    const fetchURL = "https://run.chayns.codes/f11828e3/api"
    const count = 10
    const now = new Date()

    const [news, setNews] = useState([])
    const [showNews, setShowNews] = useState(false)
    const [counter, setCounter] = useState(0)

    async function laodMore() {
        await fetchNews(true)
    }
    function getTimestampOfOldestLoadedNewsEntry() {
        if(news.length <= 1) { // if no news entries are loaded yet, just use the current timestamp (timestamp when the page was loaded)
            return now.getTime()
        }
        //  if entries are already loaded take the timestamp of the oldest
        const oldestLoadedNewsEntry = news[news.length-1]
        return oldestLoadedNewsEntry.publishTimestamp
    }
    async function fetchNews(offset = false) {  // if offset is true, last value of current news array gets popped
        // generate fetchURL with parameters
        let fetchURLWithParameters = `${fetchURL}?`
        fetchURLWithParameters += `timestamp=${getTimestampOfOldestLoadedNewsEntry()}&count=${count}&past=true&categoryId=0&locationOnly=false&TappID=91958&noCache=false`

        // try to load news entries
        console.log(`try fetch news entries with the URL with parameters:" ${fetchURLWithParameters}"...`)
        const response = await fetch(fetchURLWithParameters)
        const parsedResponse = await response.json()
        const itemList = parsedResponse.itemList
        setNews(prevState => {
            if (offset)
            {
                prevState.pop()
                return (prevState.concat(itemList))
            }
            return (itemList)
        })
        console.log(`fetched ${count} news entries: `, news, news.length)
    }
    async function publish(data) {
        console.log(JSON.stringify(data))
        await fetch(fetchURL , {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            })
        setCounter(c => ++c)
        fetchNews(false)
    }
    useEffect(() => {
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
                <AddNewsEntry onPublish = {publish} now = {now} />
                <Checkbox
                    checked = {showNews}
                    onChange = {setShowNews}
                    id = {styles.cbShowMore}
                >Show news
                </Checkbox>
            </AnimationWrapper>
            {console.log(news, news.length, showNews, (news.length > 0 && showNews))}
            {(news && Array.isArray(news), news.length > 0 && showNews) 
            ? <NewsList news = {news} now = {now} counter={counter}/> 
            : "loading..."}
            <div className={styles.btContainer}>
                <Button id={styles.btLoadMore} onClick={laodMore}>Mehr</Button>
            </div>
        </div>
    )
}
export default App