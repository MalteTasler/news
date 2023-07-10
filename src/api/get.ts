export const getNews = async (
    fetchURLWithParameters: string,
    tobitAccessToken: string
): Promise<Response> =>
    fetch(fetchURLWithParameters, {
        headers: {
            Authorization: `bearer ${tobitAccessToken}`,
        },
    });
