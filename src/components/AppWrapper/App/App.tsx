import React, { FC, useEffect, useState } from 'react'
import { getParameters } from 'chayns-api'
import { AnimationWrapper, Button } from 'chayns-components'
import { getNews } from 'api/get'
import { postNewsEntry } from 'api/post'
import { patchNewsEntry } from 'api/patch'
import { deleteNewsEntry } from 'api/delete'
import { BACKEND_URLS, COUNT, FRONTEND_URLS } from 'constants/config'
import DeveloperTools from './DeveloperTools/DeveloperTools'
import NewsList from './NewsList/NewsList'
import AddNewsEntry from './AddNewsEntry/AddNewsEntry'
import styles from './App.module.scss'
import { IListResponse, INews, INewsBase, IParameters } from '../../../constants/interfaces'

require('../../../constants/chayns.d')
require('../../../constants/chayns-components.d')

const App: FC = () => {
    const ADMIN_MODE : boolean = chayns.env.user.adminMode as boolean
    const SITE_ID : string = chayns.env.site.id 
    const TAPP_ID : number = chayns.env.site.tapp.id 
    const TOBIT_ACCESS_TOKEN = chayns.env.user.tobitAccessToken 
        
    const [news, setNews] = useState<INews[]>([])
    const [useBackend, setUseBackend] = useState<number>(1)
    const [URLparam, setURLparam] = useState<IParameters>()
    const [showNews, setShowNews] = useState<boolean>(true)
    const [, setCounter] = useState<number>(0)
    const [numberOfFetchedNews, setNumberOfFetchedNews] = useState<number>(0)
    const [numberOfDisplayedNews, setNumberOfDisplayedNews] = useState<number>(0)
    const [numberOfDatabaseNews, setNumberOfDatabaseNews] = useState<number | null>(null)
    const [numberOfDatabaseUnhiddenNews, setNumberOfDatabaseUnhiddenNews] = useState<number | null>(null)
    const [loadMoreButtonIsEnabled, setLoadMoreButtonIsEnabled] = useState<boolean>(false)
    
    let now = new Date()

    const laodMore = async() => {
        // console.log("trying to laod more")
        await fetchNews(true)
    }
    const navigateToAllNews = () => {
        setURLparam({M: false})        
    }
    function getTimestamp(newest = false):string | number {
        if(!news || !Array.isArray(news) || news.length <= 1 || newest) { 
            // if no news entries are loaded yet or the parmeter "newest" is set to true, just use the current timestamp (timestamp when the page was loaded) which can be done by setting it to 0
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
    
    const fetchNews = async(offset = false, param = URLparam) => {  
        // if offset is true, last value of current news array gets popped
        // console.log("param m ", param, param?.M, (param?.M === null || param?.M === undefined || param?.M === false))
        if(!param?.M) 
        // if no parameter for a news entry is used in the URL, load multiple entries
        {
            // generate fetchURL with parameters
            const fetchURLWithParameters = `${BACKEND_URLS[useBackend]}?siteId=${SITE_ID}&tappId=${TAPP_ID}&timestamp=${getTimestamp(!offset)}&count=${COUNT}&adminMode=${ADMIN_MODE as unknown as string}`
            // console.log("URL for fetching ", fetchURLWithParameters)
    
            const response = await getNews(fetchURLWithParameters, TOBIT_ACCESS_TOKEN)            
            switch(response.status)
            {
                // Bad Request
                case 400:
                {
                    console.error("Bad Request")
                    break;
                }
                // No Content
                case 204:
                {
                    setNumberOfDatabaseNews(0)
                    setNumberOfDatabaseUnhiddenNews(0)
                    setNumberOfFetchedNews(0)
                    setNumberOfDisplayedNews(0)
                    break;
                }
                default:
                {
                    const parsedResponse = await response.json() as IListResponse
                    const { itemList, fullLength, length } = parsedResponse
                    // console.log("fetched list of news ", parsedResponse)
                    setNews((prevState:INews[]):INews[] => {
                        if (offset)
                        {
                            // console.log("as offset is true concat the list", itemList)
                            itemList.shift();
                            return (prevState.concat(itemList))
                        }
                        return (itemList)
                    })
                    setNumberOfDatabaseNews(fullLength)
                    setNumberOfDatabaseUnhiddenNews(length)
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
        }
        else 
        // otherwise fetch only the news entry with the id defined in parameter
        {
            const id : string = param?.M as unknown as string
            // generate fetchURL with parameters
            const fetchURLWithParameters = `${BACKEND_URLS[useBackend]}/${id}`
            // console.log("try to fetch one new entry with the following link. ", fetchURLWithParameters)
            const response = await getNews(fetchURLWithParameters, TOBIT_ACCESS_TOKEN)
            const parsedResponse = await response.json() as INews
            // console.log("fetched data: ", parsedResponse)
            setNews([parsedResponse])
        }
    }
    const publish = async(data : INewsBase) => {
        // if the Id of the -entry to publish is already present in fetched data, do patch, otherwise do post
        // console.log("App #####################publishing#####################")
        // console.log(news.find((entry) => {return entry.id == data.id}))
        if(news.find((entry) => 
            entry.id === data.id
        ))
        {                        
            const fetchURLWithParameters = `${BACKEND_URLS[useBackend]}/${data.id as number}`
            // console.log("URL for fetching ", fetchURLWithParameters)
            await patchNewsEntry(fetchURLWithParameters, TOBIT_ACCESS_TOKEN, data)
            // console.log("PATCH - Response: ", response)
        }
        else
        {
            const fetchURLWithParameters = `${BACKEND_URLS[useBackend]}`
            // console.log("URL for fetching ", fetchURLWithParameters)
            await postNewsEntry(fetchURLWithParameters, TOBIT_ACCESS_TOKEN, data)
            // console.log("POST - Response: ", response)        
        }
        setCounter(c => c+1)
        now = new Date()
        await fetchNews(false)
    }
    const deleteEntry = async(id : number) => {
        const fetchURLWithParameters = `${BACKEND_URLS[useBackend]}/${id}`
        // console.log("URL for fetching ", fetchURLWithParameters)
        await deleteNewsEntry(fetchURLWithParameters, TOBIT_ACCESS_TOKEN)
        // console.log("DELETE - Response: ", response)
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
        setLoadMoreButtonIsEnabled(numberOfDatabaseUnhiddenNews ? (numberOfDisplayedNews < numberOfDatabaseUnhiddenNews) : false)
    }, [numberOfDisplayedNews, numberOfDatabaseNews, numberOfDatabaseUnhiddenNews])
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
            {ADMIN_MODE
            &&
                <div>
                    <AddNewsEntry
                        siteId = {SITE_ID}
                        tappId = {TAPP_ID}
                        onPublish = {publish}
                        now = {now} 
                    />
                    <DeveloperTools 
                        siteId = {SITE_ID}
                        tappId = {TAPP_ID}
                        numberOfDisplayedNews = {numberOfDisplayedNews}
                        numberOfFetchedNews = {numberOfFetchedNews}
                        numberOfDatabaseNews = {numberOfDatabaseNews || 0}
                        numberOfDatabaseUnhiddenNews = {numberOfDatabaseUnhiddenNews || 0}
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
                <div>{
                    (numberOfDatabaseNews === null) 
                    ? 
                        <div className = {styles.loading as string}>
                            <br />waiting for news...
                        </div>
                    :
                        <div>
                        {
                            (numberOfDatabaseNews && news && Array.isArray(news) && news.length > 0)
                            ?
                                <div className = {styles.newsContainer as string}>
                                    {URLparam?.M
                                    &&
                                        <div>Param {URLparam.M}</div>
                                    }
                                    <NewsList
                                        siteId = {SITE_ID} 
                                        tappId = {TAPP_ID} 
                                        news = {news} 
                                        now = {now} 
                                        onPatch = {publish} 
                                        onDelete = {deleteEntry} 
                                    /> 
                                    { !URLparam?.M
                                    ?
                                        <div className = {styles.btContainer as string}>
                                            <Button 
                                                disabled = {!loadMoreButtonIsEnabled} 
                                                className = {styles.btLoadMore as string} 
                                                onClick = {() => laodMore()}
                                                // title = "Mehr"
                                            >
                                                Mehr    
                                            </Button>
                                        </div>
                                    :
                                        <div 
                                            className = {styles.btContainer as string}
                                        >
                                            <Button 
                                                className = {styles.btLoadMore as string} 
                                                onClick = {() => navigateToAllNews()}
                                                // title = "Alle News anzeigen"
                                            >
                                                Alle News anzeigen
                                            </Button>                                               
                                        </div>
                                    }
                                </div>
                            :
                                "no news available."
                        }
                        </div>   
                }</div>
            }
        </div>
    )
}

App.displayName = "App"

export default App