using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EPiServer.Core;
using EPiServer.Search;
using EPiServer.Templates.Alloy.Business;
using EPiServer.Templates.Alloy.Models.Pages;
using EPiServer.Templates.Alloy.Models.ViewModels;
using EPiServer.Web;
using EPiServer.Web.Hosting;
using EPiServer.Web.Mvc.Html;

namespace EPiServer.Templates.Alloy.Controllers
{
    public class SearchPageController : PageControllerBase<SearchPage>
    {
        private const int MaxResults = 40;
        private readonly string[] _fileDirectories = new[] { "~/Global/", "~/Documents/", "~/PageFiles/" }; //Directories whose files should be searchable
        private readonly SearchService _searchService;
        private readonly ContentSearchHandler _contentSearchHandler;
        private readonly IPermanentLinkMapper _permanentLinkMapper;
        
        public SearchPageController(SearchService searchService, ContentSearchHandler contentSearchHandler, IPermanentLinkMapper permanentLinkMapper)
        {
            _searchService = searchService;
            _contentSearchHandler = contentSearchHandler;
            _permanentLinkMapper = permanentLinkMapper;
        }

        [ValidateInput(false)]
        public ViewResult Index(SearchPage currentPage, string q)
        {
            var model = new SearchPageModel(currentPage)
                {
                    SearchServiceDisabled = !_searchService.IsActive,
                    SearchedQuery = q
                };

            if(!string.IsNullOrWhiteSpace(q) && _searchService.IsActive)
            {
                var hits = Search(q.Trim(), ContentReference.StartPage, ControllerContext.HttpContext, currentPage.LanguageID).ToList();
                model.Hits = hits;
                model.NumberOfHits = hits.Count();
            }

            return View(model);
        }

        /// <summary>
        /// Performs a search for pages and files and maps each result to the view model class SearchHit.
        /// </summary>
        /// <remarks>
        /// The search functionality is handled by the injected SearchService in order to keep the controller simple.
        /// Uses EPiServer Search. For more advanced search functionality such as keyword highlighting,
        /// facets and search statistics consider using EPiServer Find.
        /// </remarks>
        private IEnumerable<SearchPageModel.SearchHit> Search(string searchText, PageReference rootPage, HttpContextBase context, string languageBranch)
        {
            var searchResults = _searchService.Search(searchText, rootPage, context, languageBranch, _fileDirectories, MaxResults);

            return searchResults.IndexResponseItems.SelectMany(CreateHitModel);
        }

        private IEnumerable<SearchPageModel.SearchHit> CreateHitModel(IndexResponseItem responseItem)
        {
            if (responseItem.ItemType == VersioningFileSystemSearchHandler.UnifiedFileItemType)
            {
                yield return CreateFileHit(responseItem);
            }
            else
            {
                //If it's not a file it must be a page
                var page = _contentSearchHandler.GetContent<PageData>(responseItem);
                if (page != null && page.HasTemplate() && page.CheckPublishedStatus(PagePublishedStatus.Published))
                {
                    yield return CreatePageHit(page);
                }
            }
        }

        private SearchPageModel.SearchHit CreateFileHit(IndexResponseItem responseItem)
        {
            var hitUrl = _permanentLinkMapper.Find(new UrlBuilder(responseItem.Uri)).MappedUrl;

            return new SearchPageModel.SearchHit
            {
                Title = responseItem.Title,
                Url = new HtmlString(hitUrl.ToString())
            };
        }

        private SearchPageModel.SearchHit CreatePageHit(PageData page)
        {
            return new SearchPageModel.SearchHit
                {
                    Title = page.PageName,
                    Url = Url.PageUrl(page.LinkURL),
                    Excerpt = page is SitePageData ? ((SitePageData) page).TeaserText : string.Empty
                };
        }
    }
}
