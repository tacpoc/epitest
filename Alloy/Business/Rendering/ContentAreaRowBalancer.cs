using System.Collections.Generic;
using System.Linq;
using System.Web;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Framework.Web;
using EPiServer.Web;

namespace EPiServer.Templates.Alloy.Business.Rendering
{
    /// <summary>
    /// Divides content in a content area into rows, striving to fill all rows.
    /// </summary>
    public class ContentAreaRowBalancer
    {
        private readonly TemplateResolver _templateResolver;
        private readonly ContentRequestContext _contentRequestContext;

        public ContentAreaRowBalancer(TemplateResolver templateResolver, ContentRequestContext contentRequestContext)
        {
            _templateResolver = templateResolver;
            _contentRequestContext = contentRequestContext;
        }

        public virtual IEnumerable<List<RowItem>> GetContentAreaRows(IEnumerable<IContent> contents, HttpContextBase httpContext, string tag)
        {
            var row = new List<RowItem>();

            var rowWidth = Global.ContentAreaTagWidths[tag];
            var spaceLeft = rowWidth;

            foreach (var content in contents)
            {
                var rowItem = CreateRowItemForContent(httpContext, content, rowWidth);
                if(rowItem.CanFitInto(spaceLeft))
                {
                    row.Add(rowItem);
                    spaceLeft -= rowItem.Width;
                } 
                else if(rowItem.CanFitInto(rowWidth))
                {
                    //The item won't fit in the current row but fits into the content area. Expand and return current row and add the item to a new row.
                    ExpandItemsToFillRow(row, rowWidth);
                    spaceLeft = rowWidth;
                    yield return row;
                    row = new List<RowItem>();
                    row.Add(rowItem);
                    spaceLeft -= rowItem.Width;
                }
                else
                {
                    //The item won't fit into the content area. Show message to editors or proceed with the next item
                    if (_contentRequestContext.IsInEditMode(httpContext))
                    {
                        rowItem = GetEditorMessage(httpContext, content);
                        if (rowItem != null)
                        {
                            row.Add(rowItem);
                            spaceLeft -= rowItem.Width;
                        }
                    }
                }
            }

            //Last row, expand and return if it's not empty
            if (row.Any())
            {
                if (spaceLeft > 0)
                {
                    ExpandItemsToFillRow(row, rowWidth);
                }
                yield return row;
            }
        }

        private RowItem CreateRowItemForContent(HttpContextBase httpContext, IContent content, int rowWidth)
        {
            var templates = GetTemplates(httpContext, content, rowWidth).ToList();
            return new RowItem(content, templates);
        }

        /// <summary>
        /// Finds all available templates for the content which can be used given the content areas width
        /// </summary>
        private IEnumerable<TemplateModel> GetTemplates(HttpContextBase httpContext, IContent content, int areaWidth)
        {
            var minWidth = 0;
            var limitingContent = content as ILimitedContentAreaAvailability;
            if (limitingContent != null)
            {
                minWidth = limitingContent.MinimumWidthInContentArea;
            }
            var possibleSizeTags = Global.ContentAreaTagWidths
                .Where(x => x.Value >= minWidth && x.Value <= areaWidth)
                .Select(x => x.Key);
            
            foreach (var sizeTag in possibleSizeTags)
            {
                var sizeTemplate = _templateResolver.Resolve(httpContext, content.GetOriginalType(), content, TemplateTypeCategories.MvcPartial, sizeTag);
                if (sizeTemplate != null)
                {
                    yield return sizeTemplate;
                }
            }
        }

        private static void ExpandItemsToFillRow(IEnumerable<RowItem> row, int rowWidth)
        {
            //Create shallow copy of row which will be used to keep track of row items which may still be expanded
            var candidatesForExpansion = row.Skip(0).ToList();

            while (row.Sum(x => x.Width) < rowWidth && candidatesForExpansion.Count > 0)
            {
                foreach (var rowItem in row)
                {
                    var nextWidth = rowItem.SupportedWidths.OrderBy(x => x).SkipWhile(x => x <= rowItem.Width).FirstOrDefault();
                    if (nextWidth == 0)
                    {
                        candidatesForExpansion.Remove(rowItem);
                        continue;
                    }
                    var widthAddition = nextWidth - rowItem.Width;
                    if (widthAddition > 0 && row.Sum(x => x.Width) + widthAddition <= rowWidth)
                    {
                        rowItem.Width = nextWidth;
                    }
                }
            }
        }

        private RowItem GetEditorMessage(HttpContextBase httpContext, IContent content)
        {
            var editorMessageTemplate = _templateResolver.Resolve(httpContext, content.GetOriginalType(), content, TemplateTypeCategories.MvcPartial, Global.ContentAreaTags.NoRenderer);
            if (editorMessageTemplate == null)
            {
                return null;
            }

            return new RowItem(content, new List<TemplateModel> { editorMessageTemplate })
            {
                IsEditorMessage = true
            };
        }

        public class RowItem
        {
            public RowItem(IContent content, IEnumerable<TemplateModel> templates)
            {
                Content = content;
                Templates = templates;
            }

            public IContent Content { get; private set; }
            public IEnumerable<TemplateModel> Templates { get; private set; }
            public bool IsEditorMessage { get; set; }
            public IEnumerable<int> SupportedWidths
            {
                get
                {
                    return Templates.SelectMany(GetSupportedWidthsByTemplate).Distinct();
                }
            }

            private static IEnumerable<int> GetSupportedWidthsByTemplate(TemplateModel templateModel)
            {
                var tags = templateModel.Tags ?? new string[0];

                if(tags.Contains(Global.ContentAreaTags.NoRenderer))
                {
                    //The editor message supports all widths
                    return Global.ContentAreaTagWidths.Select(x => x.Value);
                }

                var widths = tags.Where(x => Global.ContentAreaTagWidths.ContainsKey(x))
                    .Select(x => Global.ContentAreaTagWidths[x])
                    .ToArray();

                if (widths.Any())
                {
                    return widths;
                }

                return Global.ContentAreaTagWidths.Values;
            }

            private int MinWidth
            {
                get
                {
                    if(!SupportedWidths.Any())
                    {
                        return 0;
                    }
                    return SupportedWidths.Min();
                }
            }

            private int? _width;
            public int Width
            {
                get
                {
                    if(_width.HasValue)
                    {
                        return _width.Value;
                    }

                    return MinWidth;
                }

                set
                {
                    _width = value;
                }
            }

            public bool CanFitInto(int width)
            {
                return Templates.Any() && MinWidth <= width;
            }

            public TemplateModel GetTemplate()
            {
                return Templates.First(x => GetSupportedWidthsByTemplate(x).Contains(Width));
            }
        }
    }
}