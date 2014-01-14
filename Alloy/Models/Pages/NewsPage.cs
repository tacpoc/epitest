using System.ComponentModel.DataAnnotations;
using EPiServer.DataAbstraction;
using EPiServer.Filters;
using EPiServer.Framework.Localization;
using EPiServer.ServiceLocation;
using EPiServer.Templates.Alloy.Business;
using EPiServer.Templates.Alloy.Models.Blocks;

namespace EPiServer.Templates.Alloy.Models.Pages
{
    /// <summary>
    /// Presents a news section including a list of the most recent articles on the site
    /// </summary>
    [SiteContentType(GUID = "638D8271-5CA3-4C72-BABC-3E8779233263")]
    [SiteImageUrl]
    public class NewsPage : StandardPage
    {
        [Display(
            GroupName = SystemTabNames.Content,
            Order = 305)]
        public virtual PageListBlock NewsList { get; set; }

        public override void SetDefaultValues(ContentType contentType)
        {
            base.SetDefaultValues(contentType);

            NewsList.PageListCount = 20;
            NewsList.PageListHeading = ServiceLocator.Current.GetInstance<LocalizationService>().GetString("/newspagetemplate/latestnews");
            NewsList.PageListIncludeIntroduction = true;
            NewsList.PageListIncludePublishDate = true;
            NewsList.PageListRecursive = true;
            NewsList.PageListPageTypeFilter = typeof(ArticlePage).GetPageType();
            NewsList.PageListSortOrder = FilterSortOrder.PublishedDescending;
        }
    }
}