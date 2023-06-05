import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import { getParameters } from 'chayns-api'
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
    const [URLparam, setURLparam] = useState({M: false})
    const [showNews, setShowNews] = useState(true)
    const [counter, setCounter] = useState(0)
    const [loadMoreButtonIsEnabled, setLoadMoreButtonIsEnabled] = useState(false)

    async function laodMore() {
        //await fetchNews(true)
    }
    async function navigateToAllNews() {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        setURLparam({})
        /* console.log("waiting 3 seconds")
        await delay(3000)
        console.log("3 seconds end", URLparam, URLparam.M)
        await fetchNews(true) */
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
    async function fetchNews(offset = false, param = URLparam) {  // if offset is true, last value of current news array gets popped
        console.log("fetching news with id - ", param, (param.M == (null || undefined)))

        if(param.M == (null || undefined) ) // if no parameter for a news entry is used in the URL, load multiple entries
        {

            // generate fetchURL with parameters
            const fetchURLWithParameters = `${fetchURL}?timestamp=${getTimestampOfOldestLoadedNewsEntry()}&count=${count}&past=true&categoryId=0&locationOnly=false&TappID=91958&noCache=false`
    
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
        else if(param.M !== false) // otherwise fetch only the news entry with the id defined in parameter
        {
            const id : string = param.M as string

            // generate fetchURL with parameters
            const fetchURLWithParameters = `${fetchURL}/${id}`
            console.log("try to fetch one new entry with the following link. ", fetchURLWithParameters)

            // try to load news entries
            const response = await fetch(fetchURLWithParameters)
            const parsedResponse = await response.json() as IResponse
            console.log("fetched data: ", parsedResponse)
            setNews((prevState:INews[]):INews[] => [parsedResponse])
        }
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
        setURLparam(getParameters())
        const getItems = async() => {
            await fetchNews(false)
        }
        getItems()       
    }, [])
    
    /*  useEffect(() => {
    }, [news]) */
    
    useEffect(() => {
        /* const delay = ms => new Promise(res => setTimeout(res, ms));
        const scrollToNewsEntry = async() => {
            console.log("waiting 3 seconds")
            await delay(3000)
            console.log("3 seconds end", URLparam, URLparam.M)
            chayns.scrollTo(3000)
            //document.getElementById("3c34d4ae-2dc0-4898-9f4c-8589361bb66c")?.scrollIntoView()
        }
        scrollToNewsEntry() */

        const getItems = async() => {
            await fetchNews(false)
        }
        getItems()     


    }, [URLparam])

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
                    <div>
                    {
                        (!URLparam.M)
                        ?
                            <div className={styles.newsContainer}>
                                <NewsList news = {news} now = {now} counter = {counter} onDelete = {deleteEntry} frontendURL = {frontendURL} /> 
                                <div className={styles.btContainer}>
                                    <Button disabled = {!loadMoreButtonIsEnabled} id={styles.btLoadMore} onClick={() => laodMore}>Mehr</Button>
                                </div>
                            </div>
                        :
                            <div className={styles.newsContainer}>
                                <div>Param {URLparam.M}</div>
                                <NewsList news = {news} now = {now} counter = {counter} onDelete = {deleteEntry} frontendURL = {frontendURL} /> 
                                <div className={styles.btContainer}>
                                    <Button id={styles.btLoadMore} onClick={() => navigateToAllNews()}>
                                        Alle News anzeigen
                                    </Button>
                                </div>
                            </div>
                    }
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