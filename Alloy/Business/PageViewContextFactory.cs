using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using EPiServer.Core;
using EPiServer.Templates.Alloy.Helpers;
using EPiServer.Templates.Alloy.Models.Pages;
using EPiServer.Templates.Alloy.Models.ViewModels;
using EPiServer.Web.Routing;

namespace EPiServer.Templates.Alloy.Business
{
    public class PageViewContextFactory
    {
        private readonly IContentLoader _contentLoader;
        private readonly UrlResolver _urlResolver;
        public PageViewContextFactory(IContentLoader contentLoader, UrlResolver urlResolver)
        {
            _contentLoader = contentLoader;
            _urlResolver = urlResolver;
        }

        public virtual LayoutModel CreateLayoutModel(ContentReference currentContentLink, RequestContext requestContext)
        {
            var startPage = _contentLoader.Get<StartPage>(ContentReference.StartPage);
            
            var companyPages = _contentLoader.GetChildren<PageData>(startPage.CompanyInformationPageLink)
                .FilterForDisplay(requirePageTemplate: true)
                .ToList();
            companyPages.Insert(0, _contentLoader.Get<PageData>(startPage.CompanyInformationPageLink));

            return new LayoutModel
                {
                    Logotype = startPage.SiteLogotype,
                    LogotypeLinkUrl = new MvcHtmlString(_urlResolver.GetVirtualPath(ContentReference.StartPage)),
                    ProductPages = _contentLoader.GetChildren<ProductPage>(ContentReference.StartPage).FilterForDisplay(requirePageTemplate: true),
                    CompanyInformationPages = companyPages,
                    NewsPages = _contentLoader.GetChildren<PageData>(startPage.NewsPageLink).FilterForDisplay(requirePageTemplate: true),
                    CustomerZonePages = _contentLoader.GetChildren<PageData>(startPage.CustomerZonePageLink).FilterForDisplay(requirePageTemplate: true),
                    LoggedIn = requestContext.HttpContext.User.Identity.IsAuthenticated,
                    LoginUrl = new MvcHtmlString(GetLoginUrl(currentContentLink)),
                    SearchPageRouteValues = requestContext.GetPageRoute(startPage.SearchPageLink)
                };
        }

        private string GetLoginUrl(ContentReference returnToContentLink)
        {
            return string.Format(
                "{0}?ReturnUrl={1}", 
                FormsAuthentication.LoginUrl,
                _urlResolver.GetVirtualPath(returnToContentLink));
        }

        public virtual IContent GetSection(ContentReference contentLink)
        {
            var currentContent = _contentLoader.Get<IContent>(contentLink);
            if(currentContent.ParentLink != null && currentContent.ParentLink.CompareToIgnoreWorkID(ContentReference.StartPage))
            {
                return currentContent;
            }

            return _contentLoader.GetAncestors(contentLink)
                .OfType<PageData>()
                .SkipWhile(x => x.ParentLink == null || !x.ParentLink.CompareToIgnoreWorkID(ContentReference.StartPage))
                .FirstOrDefault();
        }
    }
}