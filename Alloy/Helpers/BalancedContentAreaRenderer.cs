using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using EPiServer.Core;
using EPiServer.Templates.Alloy.Business;
using EPiServer.Templates.Alloy.Business.Rendering;
using EPiServer.Web.Mvc;
using EPiServer.Web.Mvc.Html;

namespace EPiServer.Templates.Alloy.Helpers
{
    /// <summary>
    /// Renders a content area using a ContentAreaRowBalancer to divide the contents of the area into rows.
    /// Wraps each content with an element with type specific CSS classes.
    /// </summary>
    public class BalancedContentAreaRenderer
    {
        private readonly IContentRenderer _contentRenderer;
        private readonly ContentAreaRowBalancer _rowBalancer;
        private readonly ContentRequestContext _contentRequestContext;

        public BalancedContentAreaRenderer(IContentRenderer contentRenderer, ContentAreaRowBalancer rowBalancer, ContentRequestContext contentRequestContext)
        {
            _contentRenderer = contentRenderer;
            _rowBalancer = rowBalancer;
            _contentRequestContext = contentRequestContext;
        }

        public virtual void RenderBalancedContentArea(HtmlHelper helper, ContentArea contentArea, string renderingTag)
        {
            //For editors in edit mode we show all contents in the area no matter of publication status and access rights.
            //For public visitors or editors in view mode we only show contents that should be visible.
            var contents = _contentRequestContext.IsInEditMode(helper.ViewContext.HttpContext)
                               ? contentArea.Contents
                               : contentArea.FilteredContents;

            var rows = _rowBalancer.GetContentAreaRows(contents, helper.ViewContext.HttpContext, renderingTag);

            var renderingSettings = new RenderingSettings(helper.ViewContext.ViewData);

            foreach (var row in rows)
            {
                RenderRow(helper, row, renderingSettings);
            }
        }

        private void RenderRow(HtmlHelper helper, IEnumerable<ContentAreaRowBalancer.RowItem> row, RenderingSettings renderingSettings)
        {
            var writer = helper.ViewContext.Writer;
            WriteRowOpeningTag(renderingSettings, writer);
            foreach (var rowItem in row)
            {
                RenderRowItem(helper, rowItem, renderingSettings);
            }
            WriteRowClosingTag(renderingSettings, writer);
        }

        private static void WriteRowOpeningTag(RenderingSettings renderingSettings, TextWriter writer)
        {
            writer.Write("<");
            writer.Write(renderingSettings.RowTag);
            if (!string.IsNullOrWhiteSpace(renderingSettings.RowCssClass))
            {
                writer.Write(" class=\"");
                writer.Write(renderingSettings.RowCssClass);
                writer.Write("\"");
            }
            writer.Write(">");
        }

        private static void WriteRowClosingTag(RenderingSettings renderingSettings, TextWriter writer)
        {
            writer.Write("</");
            writer.Write(renderingSettings.RowTag);
            writer.Write(">");
        }

        private void RenderRowItem(HtmlHelper helper, ContentAreaRowBalancer.RowItem rowItem, RenderingSettings renderingSettings)
        {
            
            WriteItemOpeningTag(helper, rowItem, renderingSettings);

            //Render the content. By doing so "inside" a ContentAreaContext RenderContentData won't crash 
            //and instead output a message should the content contain circular references.
            using (new ContentAreaContext(helper.ViewContext.RequestContext, rowItem.Content.ContentLink))
            {
                helper.RenderContentData(rowItem.Content, true, rowItem.GetTemplate(), _contentRenderer);
            }

            WriteItemClosingTag(helper, renderingSettings);
        }

        private void WriteItemOpeningTag(HtmlHelper helper, ContentAreaRowBalancer.RowItem rowItem, RenderingSettings renderingSettings)
        {
            var writer = helper.ViewContext.Writer;

            writer.Write("<");
            writer.Write(renderingSettings.ItemTag);

            WriteItemCssClasses(rowItem, renderingSettings, writer);

            if (_contentRequestContext.IsInEditMode(helper.ViewContext.HttpContext))
            {
                writer.Write(" data-epi-block-id=\"");
                writer.Write(rowItem.Content.ContentLink.ToString());
                writer.Write("\" data-epi-content-name=\"");
                writer.Write(rowItem.Content.Name);
                writer.Write("\"");
            }

            writer.Write(">");
        }

        private static void WriteItemCssClasses(ContentAreaRowBalancer.RowItem rowItem, RenderingSettings renderingSettings, TextWriter writer)
        {
            writer.Write(" class=\"block ");
            writer.Write(GetTypeSpecificCssClasses(rowItem));

            var sizeTag = Global.ContentAreaTagWidths.Single(x => x.Value == rowItem.Width).Key;
            var sizeCssClass = GetCssClassForTag(sizeTag);
            if (!string.IsNullOrWhiteSpace(sizeCssClass))
            {
                writer.Write(" ");
                writer.Write(sizeCssClass);
            }

            writer.Write(" ");
            writer.Write(sizeTag);

            if (!string.IsNullOrWhiteSpace(renderingSettings.ItemCssClass))
            {
                writer.Write(" ");
                writer.Write(renderingSettings.ItemCssClass);
            }
            writer.Write("\"");
        }

        private static string GetTypeSpecificCssClasses(ContentAreaRowBalancer.RowItem rowItem)
        {
            if(rowItem.IsEditorMessage)
            {
                return string.Empty;
            }

            string cssClass = rowItem.Content.GetOriginalType().Name.ToLowerInvariant();

            var customClassContent = rowItem.Content as ICustomCssInContentArea;
            if (customClassContent != null && !string.IsNullOrWhiteSpace(customClassContent.ContentAreaCssClass))
            {
                cssClass += string.Format(" {0}", customClassContent.ContentAreaCssClass);
            }

            return cssClass;
        }

        private static void WriteItemClosingTag(HtmlHelper helper, RenderingSettings renderingSettings)
        {
            var writer = helper.ViewContext.Writer;
            writer.Write("</");
            writer.Write(renderingSettings.ItemTag);
            writer.Write(">");
        }

        /// <summary>
        /// Gets a CSS class used for styling based on a tag name (ie a Bootstrap class name)
        /// </summary>
        /// <param name="tagName">Any tag name available, see <see cref="Global.ContentAreaTags"/></param>
        private static string GetCssClassForTag(string tagName)
        {
            switch (tagName.ToLower())
            {
                case "span12":
                    return "full";
                case "span8":
                    return "wide";
                case "span6":
                    return "half";
                default:
                    return string.Empty;
            }
        }

        private class RenderingSettings
        {
            public RenderingSettings(ViewDataDictionary viewData)
            {
                RowTag = viewData["customtag"] as string;
                if (string.IsNullOrWhiteSpace(RowTag))
                {
                    RowTag = "div";
                }

                RowCssClass = viewData["cssclass"] as string;

                ItemTag = viewData["childrencustomtagname"] as string;
                if (string.IsNullOrWhiteSpace(ItemTag))
                {
                    ItemTag = "div";
                }

                ItemCssClass = viewData["childrencssclass"] as string;
            }

            public string RowTag { get; private set; }
            public string RowCssClass { get; private set; }
            public string ItemTag { get; private set; }
            public string ItemCssClass { get; private set; }
        }
    }
}