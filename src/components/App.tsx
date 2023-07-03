import React, { useEffect, useState } from 'react'
import PropTypes from "prop-types"
import { getParameters } from 'chayns-api'
import { AnimationWrapper, Button } from 'chayns-components'
import DeveloperTools from './DeveloperTools'
import NewsList from './NewsList'
import AddNewsEntry from './AddNewsEntry'
import styles from './App.module.css'
import { IResponse, IListResponse, INews, IParameters } from '../interfaces'

const App = () => {
    const frontendURL = "https://schule.chayns.net/news-page-react"
    const fetchURL = ["https://run.chayns.codes/f11828e3/api", "https://localhost:7106/news"]
    const adminMode : boolean = chayns.env.user.adminMode as boolean
    const siteId : string = chayns.env.site.id as string
    const tappId : number = chayns.env.site.tapp.id as number
    const tobitAccessToken : string = chayns.env.user.tobitAccessToken as string
    const count = 10 // maximum number of news to fetch
    let now = new Date()

    const [news, setNews] = useState<INews[]>([])
    const [useBackend, setUseBackend] = useState<number>(1)
    const [URLparam, setURLparam] = useState<IParameters>()
    const [showNews, setShowNews] = useState(true)
    const [counter, setCounter] = useState(0)
    const [numberOfFetchedNews, setNumberOfFetchedNews] = useState(0)
    const [numberOfDisplayedNews, setNumberOfDisplayedNews] = useState(0)
    const [numberOfDatabaseNews, setNumberOfDatabaseNews] = useState(null)
    const [loadMoreButtonIsEnabled, setLoadMoreButtonIsEnabled] = useState(false)

    const laodMore = async() => {
        // console.log("trying to laod more")
        await fetchNews(true)
    }
    const navigateToAllNews = () => {
        setURLparam({M: false})
        /* 
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(3000)
        */
    }
    function getTimestamp(newest = false):string | number {
        if(!news || !Array.isArray(news) || news.length <= 1 || newest) { // if no news entries are loaded yet or the parmeter "newest" is set to true, just use the current timestamp (timestamp when the page was loaded) which can be done by setting it to 0
            // console.log("give now time")
            return now.getTime()
        }
        //  if entries are already loaded take the timestamp of the oldest
        // console.log("give oldest time")
        const oldestLoadedNewsEntry : INews = news[news.length-1]
        if (oldestLoadedNewsEntry)
            return (oldestLoadedNewsEntry.publishTimestamp)
        return now.getTime()
    }
    const setShowNewsFunc = (data : boolean) => {
        setShowNews(data)
    }
    
    const fetchNews = async(offset = false, param = URLparam) => {  // if offset is true, last value of current news array gets popped
        // console.log("param m ", param, param?.M, (param?.M === null || param?.M === undefined || param?.M === false))
        if(!param?.M) // if no parameter for a news entry is used in the URL, load multiple entries
        {
            // generate fetchURL with parameters
            const fetchURLWithParameters = `${fetchURL[useBackend]}?siteId=${siteId}&tappId=${tappId}&timestamp=${getTimestamp(!offset)}&count=${count}&adminMode=${adminMode as unknown as string}`
    
            // try to load news entries
            console.log("try to fetch data via URI ", fetchURLWithParameters)
            const response = await fetch(fetchURLWithParameters)
            console.log("unparsed response ", response, response.status, response.status === 204)
            if(!response.ok)
                return false
            if(response.status === 204) // No Content
            {
                setNumberOfDatabaseNews(0)
                setNumberOfFetchedNews(0)
                setNumberOfDisplayedNews(0)
            }
            else
            {
                const parsedResponse = await response.json() as IListResponse
                const { itemList, length } = parsedResponse
                console.log("fetched data with URL: ", fetchURLWithParameters, parsedResponse)
                setNews((prevState:INews[]):INews[] => {
                    if (offset)
                    {
                        console.log("as offset is true concat the list", itemList)
                        itemList.shift();
                        return (prevState.concat(itemList))
                    }
                    return (itemList)
                })
                setNumberOfDatabaseNews(length)
                const number = itemList.length; // number of new fetched entries
                // console.log(`fetched ${number} new entries`)
                if(offset)
                {
                    setNumberOfFetchedNews(prevState => prevState + number)
                    if(number > 10)
                        setNumberOfDisplayedNews(prevState => prevState + 10)
                    else
                        setNumberOfDisplayedNews(prevState => prevState + number)
                }
                else
                {
                    setNumberOfFetchedNews(number)
                    if(number > 10)
                        setNumberOfDisplayedNews(10)
                    else
                        setNumberOfDisplayedNews(number)
                }
            }
        }
        else // otherwise fetch only the news entry with the id defined in parameter
        {
            const id : string = param?.M as unknown as string

            // generate fetchURL with parameters
            const fetchURLWithParameters = `${fetchURL[useBackend]}/${id}`
            // console.log("try to fetch one new entry with the following link. ", fetchURLWithParameters)

            // try to load news entries
            const response = await fetch(fetchURLWithParameters)
            const parsedResponse = await response.json() as IResponse
            // console.log("fetched data: ", parsedResponse)
            setNews([parsedResponse])
        }
    }
    const publish = async(data : INews) => {
        // const delay = ms => new Promise(res => setTimeout(res, ms));
        // if the Id of the -entry to publish is already present in fetched data, do put
        // console.log(data, news, news.find((entry) => {return entry.id == data.id}))
        if(news.find((entry) => 
            entry.id === data.id
        ))
        {            
            await putEntry(data)
        }
        else
            await postEntry(data)
        setCounter(c => c+1)
        now = new Date()
        // await delay(3000)
        await fetchNews(false)
    }
    const postEntry = async(data : INews) => {
        const fetchURLWithParameters = `${fetchURL[useBackend]}`
        console.log("POST ", data, JSON.stringify(data))
        await fetch(fetchURLWithParameters , {
            method: "POST",
            body: JSON.stringify({
                siteId: data.siteId,
                tappId: data.tappId,
                imageList: data.imageList,
                headline: data.headline,
                message: data.message,
                publishTime: data.publishTime,
                publishTimestamp: data.publishTimestamp,
                hidden: data.hidden
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization" : `bearer ${tobitAccessToken}`
            }
        })
    }
    const putEntry = async(data : INews) => {
        const fetchURLWithParameters = `${fetchURL[useBackend]}/${data.id as string}`
        console.log("PUT ", data, JSON.stringify(data))
        await fetch(fetchURLWithParameters , {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization" : `bearer ${tobitAccessToken}`
            }
        })
    }
    const patchEntry = async(data : INews) => {
        // ! hardcode TEST with prop 'hidden' for now
        const fetchURLWithParameters = `${fetchURL[useBackend]}/${data.id as string}/hidden`
        console.log("PATCH ", data, JSON.stringify(data))
        await fetch(fetchURLWithParameters , {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization" : `bearer ${tobitAccessToken}`
            }
        })
        await fetchNews(false)
    }
    const deleteEntry = async(id : string) => {
        const fetchURLWithParameters = `${fetchURL[useBackend]}/${id}`
        await fetch(fetchURLWithParameters , {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization" : `bearer ${tobitAccessToken}`
            }
        })
        setCounter(c => c+1)
        await fetchNews(false)
    }

    useEffect(() => {
        const getItems = async() => {
            await fetchNews(false)
        }
        const params : {
            [key: string]: string; [key: symbol]: string;
        } = getParameters()
        // console.log("received parameters:", params, (params.M !== undefined))
        // check if paramters are valid
        if(params.M !== undefined)
            setURLparam({M : params.M})
        else
            void getItems()       
    },
    [])
    useEffect(() => {
        // console.log((numberOfDisplayedNews < numberOfDatabaseNews))
        setLoadMoreButtonIsEnabled((numberOfDisplayedNews < numberOfDatabaseNews))
    }, [numberOfDisplayedNews, numberOfDatabaseNews])
    useEffect(() => {
        const getItems = async() => {
            await fetchNews(false)
        }
        void getItems()     
    },
    [URLparam])
    useEffect(() => { // ! redundancy? test
        const getItems = async() => {
            await fetchNews(false)
        }
        void getItems()  
    },
    [useBackend])

    return (
        <div className = {styles.main as string}>
            <AnimationWrapper>
                <h1 id = "pageHeadline">Aktuelle News</h1>
                <p id = "pageSubHeadline">Kurz, kompakt und immer wieder frisch informieren wir hier über aktuelle Themen und Aktionen.</p>
            </AnimationWrapper>
            {adminMode &&
                <div>
                    <AddNewsEntry
                        siteId = {siteId}
                        tappId = {tappId}
                        onPublish = {publish}
                        now = {now} 
                    />
                    <DeveloperTools 
                        siteId= {siteId}
                        tappId = {tappId}
                        numberOfDisplayedNews = {numberOfDisplayedNews}
                        numberOfFetchedNews = {numberOfFetchedNews}
                        numberOfDatabaseNews = {numberOfDatabaseNews}
                        showNews = {showNews}
                        cbShowNewsOnChange = {setShowNewsFunc}
                        useBackend = {useBackend}
                        setUseBackend = {setUseBackend}
                    />
                </div>
            }
            <br />
            {
                (showNews)
                &&
                    (numberOfDatabaseNews === null) 
                    ? 
                        <div className = {styles.loading as string}>
                            <br />waiting for news... {console.log(numberOfDatabaseNews)}
                        </div>
                    :
                        <div>
                        {
                            (numberOfDatabaseNews && news && Array.isArray(news) && news.length > 0)
                            ?
                                <div className={styles.newsContainer as string}>
                                    {URLparam?.M
                                    &&
                                        <div>Param {URLparam.M}</div>
                                    }
                                    <NewsList
                                        siteId = {siteId} 
                                        tappId = {tappId} 
                                        news = {news} 
                                        now = {now} 
                                        onPut = {publish} 
                                        onPatch = {patchEntry} 
                                        onDelete = {deleteEntry} 
                                        frontendURL = {frontendURL} 
                                    /> 
                                    {!URLparam?.M
                                    &&
                                        <div className={styles.btContainer as string}>
                                            <Button disabled = {!loadMoreButtonIsEnabled} id={styles.btLoadMore as string} onClick={() => laodMore()}>Mehr</Button>
                                        </div>
                                    }
                                    {URLparam?.M
                                    &&
                                        <div className={styles.btContainer as string}>
                                            <Button id={styles.btLoadMore as string} onClick={() => navigateToAllNews()}>
                                                Alle News anzeigen
                                            </Button>
                                        </div>
                                    }
                                </div>
                            :
                                "no news available."
                        }
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