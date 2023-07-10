export const deleteNewsEntry = async (
    fetchUrlWithParameters: string,
    tobitAccessToken: string
): Promise<Response> =>
    fetch(fetchUrlWithParameters, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `bearer ${tobitAccessToken}`,
        },
    });
