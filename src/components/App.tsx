import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import { AnimationWrapper, Button, Checkbox } from 'chayns-components'
import NewsList from './NewsList'
import AddNewsEntry from './AddNewsEntry'
import styles from './App.module.css'
import { IResponse, INews } from '../interfaces'

const App = () => {
    const frontendURL = "https://schule.chayns.net/news-page-react"
    const fetchURL = "https://run.chayns.codes/f11828e3/api"
    const count = 10
    const now = new Date()

    const [news, setNews] = useState<INews[]>([])
    const [showNews, setShowNews] = useState(false)
    const [counter, setCounter] = useState(0)
    const [loadMoreButtonIsEnabled, setLoadMoreButtonIsEnabled] = useState(false)

    async function laodMore() {
        await fetchNews(true)
    }
    function getTimestampOfOldestLoadedNewsEntry():string | number {
        if(!news || !Array.isArray(news) || news.length <= 1) { // if no news entries are loaded yet, just use the current timestamp (timestamp when the page was loaded)
            return now.getTime()
        }
        //  if entries are already loaded take the timestamp of the oldest
        const oldestLoadedNewsEntry : INews = news[news.length-1]
        if (oldestLoadedNewsEntry)
            return (oldestLoadedNewsEntry.publishTimestamp)
        return now.getTime()
    }
    async function fetchNews(offset = false) {  // if offset is true, last value of current news array gets popped
        // generate fetchURL with parameters
        let fetchURLWithParameters = `${fetchURL}?`
        fetchURLWithParameters += `timestamp=${getTimestampOfOldestLoadedNewsEntry()}&count=${count}&past=true&categoryId=0&locationOnly=false&TappID=91958&noCache=false`

        // try to load news entries
        const response = await fetch(fetchURLWithParameters)
        const parsedResponse = await response.json() as IResponse[]
        /* console.log("fetched data: ", parsedResponse) */
        setNews((prevState:INews[]):INews[] => {
            if (offset)
            {
                prevState.pop()
                return (prevState.concat(parsedResponse))
            }
            return (parsedResponse)
        })
    }
    async function publish(data : INews) {
        await fetch(fetchURL , {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
            })
        setCounter(c => c+1)
        await fetchNews(false)
    }
    async function deleteEntry(id : string) {
        await fetch(`${fetchURL}/${id}` , {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
        setCounter(c => c+1)
        await fetchNews(false)
    }
    useEffect(() => {
        const getItems = async() => {
            await fetchNews(false)
        }
        getItems()
    }, [])
    /* const localStyles : {
        cbShowMore : string;
        btContainer : string;
        btLoadMore : string;
    } =
    {
        cbShowMore : styles.cbShowMore as string,
        btContainer : styles.btContainer as string,
        btLoadMore : styles.btLoadMore as string
    } */
    return (
        <div className = {styles.main}>
            <AnimationWrapper>
                <h1 id = "pageHeadline">Aktuelle News</h1>
                <p id = "pageSubHeadline">Kurz, kompakt und immer wieder frisch informieren wir hier über aktuelle Themen und Aktionen.</p>
            </AnimationWrapper>
            {chayns.env.user.adminMode &&
                <AddNewsEntry onPublish = {publish} now = {now} />
            }
            <Checkbox
                checked = {showNews}
                onChange = {setShowNews}
                className = {styles.cbShowMore}
            >
                Show news
            </Checkbox>
            {
                (news && Array.isArray(news) && news.length > 0 && showNews) 
                ? 
                    <div className={styles.newsContainer}>
                        <NewsList news = {news} now = {now} counter = {counter} onDelete = {deleteEntry} frontendURL = {frontendURL} /> 
                        <div className={styles.btContainer}>
                            <Button disabled = {!loadMoreButtonIsEnabled} id={styles.btLoadMore} onClick={laodMore}>Mehr</Button>
                        </div>
                    </div>
                :
                    <div className = {styles.loading}>
                        <br />waiting for news...
                    </div>
            }
        </div>
    )
}
App.propTypes = {
    NewsEntry: PropTypes.shape({
        publishTimestamp: PropTypes.string
    }),
}
export default App