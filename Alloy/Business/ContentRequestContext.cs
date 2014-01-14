using System.Web;
using EPiServer.Editor;

namespace EPiServer.Templates.Alloy.Business
{
    public class ContentRequestContext
    {
        /// <summary>
        /// Returns true if a request is in context of viewing a content in edit mode.
        /// </summary>
        /// <remarks>Wraps the static PageEditing.GetPageIsInEditMode for testing and extensibility purposes</remarks>
        public virtual bool IsInEditMode(HttpContextBase httpContext)
        {
            return PageEditing.GetPageIsInEditMode(httpContext);
        }
    }
}