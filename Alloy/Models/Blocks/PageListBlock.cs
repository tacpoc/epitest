using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Filters;

namespace EPiServer.Templates.Alloy.Models.Blocks
{
    /// <summary>
    /// Used to insert a list of pages, for example a news list
    /// </summary>
    [SiteContentType(GUID = "30685434-33DE-42AF-88A7-3126B936AEAD")]
    [SiteImageUrl]
    public class PageListBlock : SiteBlockData
    {
        [Display(
            GroupName = SystemTabNames.Content,
            Order = 1)]
        [CultureSpecific]
        public virtual string PageListHeading { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 2)]
        [DefaultValue(false)]
        public virtual bool PageListIncludePublishDate { get; set; }

        /// <summary>
        /// Gets or sets whether a page introduction/description should be included in the list
        /// </summary>
        [Display(
            GroupName = SystemTabNames.Content,
            Order = 3)]
        [DefaultValue(true)]
        public virtual bool PageListIncludeIntroduction { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 4)]
        [DefaultValue(3)]
        [Required]
        public virtual int PageListCount { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 4)]
        [DefaultValue(FilterSortOrder.PublishedDescending)]
        [UIHint("SortOrder")]
        [BackingType(typeof(PropertyNumber))]
        public virtual FilterSortOrder PageListSortOrder { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 5)]
        [Required]
        public virtual PageReference PageListRoot { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 6)]
        public virtual PageType PageListPageTypeFilter{get; set;}

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 7)]
        public virtual CategoryList PageListCategoryFilter { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 8)]
        public virtual bool PageListRecursive { get; set; }

        #region IInitializableContent

        /// <summary>
        /// Sets the default property values on the content data.
        /// </summary>
        /// <param name="contentType">Type of the content.</param>
        public override void SetDefaultValues(ContentType contentType)
        {
            base.SetDefaultValues(contentType);

            PageListCount = 3;
            PageListIncludeIntroduction = true;
            PageListIncludePublishDate = false;
            PageListSortOrder = FilterSortOrder.PublishedDescending;
        }

        #endregion
    }
}