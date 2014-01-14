using System.Collections.Generic;
using System.Web;
using EPiServer.Core;
using EPiServer.Search;
using EPiServer.Search.Queries;
using EPiServer.Search.Queries.Lucene;
using EPiServer.Security;
using EPiServer.Web.Hosting;

namespace EPiServer.Templates.Alloy.Business
{
    public class SearchService
    {
        private readonly SearchHandler _searchHandler;
        private readonly IContentLoader _contentLoader;

        public SearchService(SearchHandler searchHandler, IContentLoader contentLoader)
        {
            _searchHandler = searchHandler;
            _contentLoader = contentLoader;
        }

        public virtual bool IsActive
        {
            get { return SearchSettings.Config.Active; }
        }

        public virtual SearchResults Search(string searchText, PageReference rootPage, HttpContextBase context, string languageBranch,
                                     string[] fileDirectories, int maxResults)
        {
            var query = CreateQuery(searchText, rootPage, context, languageBranch, fileDirectories);
            return _searchHandler.GetSearchResults(query, 1, maxResults);
        }

        private IQueryExpression CreateQuery(string searchText, ContentReference rootLink, HttpContextBase context, string languageBranch, IEnumerable<string> fileLocations)
        {
            //Main query which groups other queries. Each query added
            //must match in order for a page or file to be returned.
            var query = new GroupQuery(LuceneOperator.AND);

            //Add free text query to the main query
            query.QueryExpressions.Add(new FieldQuery(searchText));

            //Create and add query which groups type conditions using OR
            var typeQueries = new GroupQuery(LuceneOperator.OR);
            query.QueryExpressions.Add(typeQueries);

            typeQueries.QueryExpressions.Add(CreateContentQuery(rootLink, languageBranch));

            if (fileLocations != null)
            {
                typeQueries.QueryExpressions.Add(CreateFileQuery(fileLocations));
            }

            var accessRightsQuery = new AccessControlListQuery();
            accessRightsQuery.AddAclForUser(PrincipalInfo.Current, context);
            query.QueryExpressions.Add(accessRightsQuery);

            return query;
        }

        private GroupQuery CreateContentQuery(ContentReference rootLink, string languageBranch)
        {
            var contentQuery = new GroupQuery(LuceneOperator.AND)
                {
                    QueryExpressions = {new ContentQuery<PageData>()}
                };
            var contentRootQuery = new VirtualPathQuery();
            contentRootQuery.AddContentNodes(rootLink, _contentLoader);
            contentQuery.QueryExpressions.Add(new FieldQuery(languageBranch, Field.Culture));
            contentQuery.QueryExpressions.Add(contentRootQuery);
            return contentQuery;
        }

        private GroupQuery CreateFileQuery(IEnumerable<string> fileLocations)
        {
            var fileQuery = new GroupQuery(LuceneOperator.AND);
            fileQuery.QueryExpressions.Add(CreateFileLocationQuery(fileLocations));
            fileQuery.QueryExpressions.Add(new UnifiedFileQuery());
            return fileQuery;
        }

        private GroupQuery CreateFileLocationQuery(IEnumerable<string> fileLocations)
        {
            var query = new GroupQuery(LuceneOperator.OR);
            foreach (string path in fileLocations)
            {
                var searchDirectory = GenericHostingEnvironment.VirtualPathProvider.GetDirectory(path.Trim()) as VersioningDirectory;
                if (searchDirectory != null)
                {
                    var item = new VirtualPathQuery();
                    for (VersioningDirectory directory = searchDirectory; directory != null; directory = directory.Parent as VersioningDirectory)
                    {
                        item.VirtualPathNodes.Insert(0, directory.Guid.ToString());
                    }
                    query.QueryExpressions.Add(item);
                }
            }
            return query;
        }
    }
}