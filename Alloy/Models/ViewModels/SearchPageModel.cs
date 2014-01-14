using System.Collections.Generic;
using System.Web;
using EPiServer.Templates.Alloy.Models.Pages;

namespace EPiServer.Templates.Alloy.Models.ViewModels
{
    public class SearchPageModel : PageViewModel<SearchPage>
    {
        public SearchPageModel(SearchPage currentPage) : base(currentPage)
        {
        }

        public bool SearchServiceDisabled { get; set; }
        public string SearchedQuery { get; set; }
        public int NumberOfHits { get; set; }
        public IEnumerable<SearchHit> Hits { get; set; }  

        public class SearchHit
        {
            public string Title { get; set; }
            public IHtmlString Url { get; set; }
            public string Excerpt { get; set; }
        }
    }
}