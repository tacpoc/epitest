using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using EPiServer.Core;
using EPiServer.Templates.Alloy.Models.Blocks;

namespace EPiServer.Templates.Alloy.Models.ViewModels
{
    public class LayoutModel
    {
        public SiteLogotypeBlock Logotype { get; set; }
        public IHtmlString LogotypeLinkUrl { get; set; }
        public RouteValueDictionary SearchPageRouteValues { get; set; }
        public bool HideHeader { get; set; }
        public bool HideFooter { get; set; }
        public IEnumerable<PageData> ProductPages { get; set; }
        public IEnumerable<PageData> CompanyInformationPages { get; set; }
        public IEnumerable<PageData> NewsPages { get; set; }
        public IEnumerable<PageData> CustomerZonePages { get; set; }
        public bool LoggedIn { get; set; }
        public MvcHtmlString LoginUrl { get; set; }
        public MvcHtmlString LogOutUrl { get; set; }
    }
}