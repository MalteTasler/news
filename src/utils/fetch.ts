import { getNews } from 'api/news/get';
import { FETCH_COUNT } from 'constants/config';
import { BackendUrls } from 'constants/enums';
import { ListResponse, News, NewsNumbers } from 'constants/interfaces';

const getTimestamp = ({
    shouldBeNewest = false,
    news = [],
}: {
    shouldBeNewest: boolean;
    news: News[];
}): string | number => {
    /* console.log(`
        shouldBeNewest: ${shouldBeNewest.toString()}\n
        news: ${news.toString()}\n
        newsLength: ${news.length.toString()}\n    
        useTimestamoOfOldestNewsEntry: ${(
            news.length >= 1 && !shouldBeNewest
        ).toString()}            
    `); */
    if (news.length >= 1 && !shouldBeNewest) {
        //  if entries are already loaded take the timestamp of the oldest
        const oldestLoadedNewsEntry: News = news[news.length - 1];
        if (oldestLoadedNewsEntry) {
            return oldestLoadedNewsEntry.publishTimestamp;
        }
    }

    // if no news entries are loaded yet or the parmeter "newest" is set to true,
    // just use the current timestamp (timestamp when the page was loaded) which can
    // be done by setting it to 0
    return new Date().getTime();
};

export const fetchNews = async ({
    shouldLoadMore,
    activeBackend,
    news,
    newsNumbers,
    newsEntryId,
}: {
    shouldLoadMore: boolean;
    activeBackend: number;
    news: News[];
    newsNumbers: NewsNumbers;
    newsEntryId: number;
}): Promise<{
    news: News[];
    numbers: NewsNumbers;
}> => {
    const numbersAfterFetch: NewsNumbers = {
        numberOfDatabaseNews: newsNumbers.numberOfDatabaseNews,
        numberOfDatabaseUnhiddenNews: newsNumbers.numberOfDatabaseUnhiddenNews,
        numberOfFetchedNews: newsNumbers.numberOfFetchedNews,
    };

    let newsAfterFetch: News[] = news;

    // if no id parameter for a news entry is used, load multiple entries
    // otherwise fetch only the news entry with the id defined in parameter
    const shouldLoadSingleNewsEntry = newsEntryId;
    /* console.log(`
        ******** FETCH NEWS ********\n
        shouldLoadSingleNewsEntry: ${shouldLoadSingleNewsEntry.toString()}\n
        newsEntryId: ${newsEntryId.toString()}\n
        shouldLoadMore: ${shouldLoadMore.toString()}\n
        activeBackend: ${activeBackend.toString()}\n
        numberOfDatabaseNews: ${(
            numbersAfterFetch.numberOfDatabaseNews || 0
        ).toString()}\n
        numberOfDatabaseUnhiddenNews: ${(
            numbersAfterFetch.numberOfDatabaseUnhiddenNews || 0
        ).toString()}\n
        numberOfFetchedNews: ${numbersAfterFetch.numberOfFetchedNews.toString()}\n
    `); */

    if (!shouldLoadSingleNewsEntry) {
        // reset local counter variables if shouldLoadMore is false
        if (!shouldLoadMore) {
            numbersAfterFetch.numberOfDatabaseUnhiddenNews = 0;
            numbersAfterFetch.numberOfFetchedNews = 0;
            numbersAfterFetch.numberOfDatabaseNews = 0;
        }

        // generate fetchURL with parameters
        let fetchURLWithParameters = BackendUrls[activeBackend];
        fetchURLWithParameters += `?siteId=${chayns.env.site.id}`;
        fetchURLWithParameters += `&tappId=${chayns.env.site.tapp.id}`;
        fetchURLWithParameters += `&timestamp=${getTimestamp({
            shouldBeNewest: !shouldLoadMore,
            news: newsAfterFetch,
        })}`;
        fetchURLWithParameters += `&count=${FETCH_COUNT}`;
        fetchURLWithParameters += `&adminMode=${(
            chayns.env.user.adminMode || false
        ).toString()}`;
        /* console.log(`
            fetchURLWithParameters: ${fetchURLWithParameters}\n            
        `); */

        const response = await getNews({
            fetchUrlWithParameters: fetchURLWithParameters,
        });
        switch (response.status) {
            // Bad Request
            case 400: {
                console.error('Bad Request');
                break;
            }
            // No Content
            case 204: {
                numbersAfterFetch.numberOfDatabaseNews = 0;
                numbersAfterFetch.numberOfDatabaseUnhiddenNews = 0;
                numbersAfterFetch.numberOfFetchedNews = 0;
                break;
            }
            default: {
                const parsedResponse = (await response.json()) as ListResponse;
                const { itemList, fullLength, length } = parsedResponse;
                if (shouldLoadMore) {
                    // last value of news itemList array gets popped (offset of one)
                    itemList.shift();
                    newsAfterFetch = newsAfterFetch.concat(itemList);
                } else {
                    newsAfterFetch = itemList;
                }
                numbersAfterFetch.numberOfDatabaseNews = fullLength;
                numbersAfterFetch.numberOfDatabaseUnhiddenNews = length;
                numbersAfterFetch.numberOfFetchedNews += itemList.length;
            }
        }
    } else {
        // generate fetchURL with parameters
        const fetchURLWithParameters = `${BackendUrls[activeBackend]}/${newsEntryId}`;
        const response = await getNews({
            fetchUrlWithParameters: fetchURLWithParameters,
        });
        const parsedResponse = (await response.json()) as News;
        newsAfterFetch = [parsedResponse];
    }

    /* console.log(
        `
        ******** FETCH NEWS END ********\n       
    `,
        numbersAfterFetch,
        newsAfterFetch
    ); */

    return {
        news: newsAfterFetch,
        numbers: numbersAfterFetch,
    };
};
