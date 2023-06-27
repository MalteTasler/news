using Microsoft.AspNetCore.Http.Extensions;

namespace NewsBackend.Helpers.Extensions;

/// <summary>
/// Extension methods to work with <see cref="HttpContext"/>
/// </summary>
public static class HttpContextExtensions
{
    /// <summary>
    /// Get the path of the current request
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    private static string GetCurrentPath(this HttpContext context)
    {
        // The split and join makes sure to only get the url with path and without any parameters
        var urlParts = context.Request.GetDisplayUrl().Split('/').ToList();
        urlParts.RemoveAt(urlParts.Count - 1);

        return string.Join('/', urlParts) + "/";
    }

    /// <summary>
    /// Get the path of the current request
    /// </summary>
    /// <param name="contextAccessor"></param>
    /// <returns></returns>
    public static string GetCurrentPath(this IHttpContextAccessor contextAccessor)
        => contextAccessor.HttpContext?.GetCurrentPath() ?? string.Empty;
}