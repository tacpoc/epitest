using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Web;

namespace EPiServer.Templates.Alloy.Models.Blocks
{
    /// <summary>
    /// Used to insert a player for a locally available video
    /// </summary>
    [SiteContentType(
        GUID = "60732EAD-61AD-43A8-8446-B4E777A29508",
        GroupName = Global.GroupNames.Specialized)]
    [SiteImageUrl]
    public class VideoBlock : SiteBlockData
    {
        [Display(
            GroupName = SystemTabNames.Content,
            Order = 1)]
        [UIHint(UIHint.Video)]
        public virtual Url VideoBlockUrl
        {
            get
            {
                var videoUrl = this.GetPropertyValue(p => p.VideoBlockUrl);

                return videoUrl == null || videoUrl.IsEmpty()
                           ? System.String.Empty
                           : videoUrl;
            }
            set
            {
                this.SetPropertyValue(p => p.VideoBlockUrl, value);
            }
        }

        [Display(
            GroupName = SystemTabNames.Content,
            Order = 2)]
        [UIHint(UIHint.Image)]
        public virtual Url VideoPreviewImageUrl
        {
            get
            {
                var imageUrl = this.GetPropertyValue(p => p.VideoPreviewImageUrl);

                return imageUrl == null || imageUrl.IsEmpty()
                           ? System.String.Empty
                           : imageUrl;
            }
            set
            {
                this.SetPropertyValue(p => p.VideoPreviewImageUrl, value);
            }
        }
    }
}
