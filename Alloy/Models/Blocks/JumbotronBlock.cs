using System.ComponentModel.DataAnnotations;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;

namespace EPiServer.Templates.Alloy.Models.Blocks
{
    /// <summary>
    /// Used for a primary message on a page, commonly used on start pages and landing pages
    /// </summary>
    [SiteContentType(
        GroupName = Global.GroupNames.Specialized,
        GUID = "9FD1C860-7183-4122-8CD4-FF4C55E096F9")]
    [SiteImageUrl]
    public class JumbotronBlock : SiteBlockData
    {
        [Display(
            GroupName = SystemTabNames.Content,
            Order = 1
            )]
        [CultureSpecific]
        [UIHint(UIHint.Image)]
        public virtual Url JumbotronImage { get; set; }
        
        /// <summary>
        /// Gets or sets a description for the image, for example used as the alt text for the image when rendered
        /// </summary>
        [Display(
            GroupName = SystemTabNames.Content,
            Order = 1
            )]
        [CultureSpecific]
        public virtual string JumbotronImageDescription
        {
            get
            {
                var propertyValue = this["JumbotronImageDescription"] as string;

                // Return image description with fall back to the heading if no description has been specified
                return string.IsNullOrWhiteSpace(propertyValue) ? JumbotronHeading : propertyValue;
            }
            set { this["JumbotronImageDescription"] = value; }
        }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 1
            )]
        [CultureSpecific]
        public virtual string JumbotronHeading { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 2
            )]
        [CultureSpecific]
        [UIHint(UIHint.Textarea)]
        public virtual string JumbotronSubHeading { get; set; }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 3
            )]
        [CultureSpecific]
        public virtual string JumbotronButtonText { get; set; }
        
        [Display(
            GroupName = SystemTabNames.Content,
            Order = 4
            )]
        [CultureSpecific]
        public virtual Url JumbotronButtonLink { get; set; }
    }
}
