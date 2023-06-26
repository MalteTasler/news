using System.Web.Http;
using System.Web.Http.Cors;
namespace NewsBackend
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Enable CORS globally
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            // Other configuration code...
        }
    }
}