using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using EPiServer.Core;
using EPiServer.Framework.DataAnnotations;
using EPiServer.Framework.Web;
using EPiServer.Templates.Alloy.Business;
using EPiServer.Templates.Alloy.Business.Rendering;
using EPiServer.Templates.Alloy.Models.Pages;
using EPiServer.Templates.Alloy.Models.ViewModels;
using EPiServer.Web;

namespace EPiServer.Templates.Alloy.Controllers
{
    /* Note: as the content area rendering on Alloy is customized we create ContentArea instances 
     * which we render in the preview view in order to provide editors with a preview which is as 
     * realistic as possible. In other contexts we could simply have passed the block to the 
     * view and rendered it using Html.RenderContentData */
    [TemplateDescriptor(
        Inherited = true, 
        TemplateTypeCategory = TemplateTypeCategories.MvcController, //Required as controllers for blocks are registered as MvcPartialController by default
        Tags = new [] { RenderingTags.Preview },
        AvailableWithoutTag = false)]
    public class PreviewController : Controller, IRenderTemplate<BlockData>, IModifyLayout
    {
        private readonly IContentLoader _contentLoader;
        private readonly ContentAreaRowBalancer _rowBalancer;
        public PreviewController(IContentLoader contentLoader, ContentAreaRowBalancer rowBalancer)
        {
            _contentLoader = contentLoader;
            _rowBalancer = rowBalancer;
        }

        public ActionResult Index(IContent currentContent)
        {
            //As the layout requires a page for title etc we "borrow" the start page
            var startPage = _contentLoader.Get<StartPage>(ContentReference.StartPage);

            var model = new PreviewModel(startPage, currentContent);

            var widthAreas = Global.ContentAreaTagWidths
                .OrderByDescending(x => x.Value)
                .Select(x => new { Tag = x.Key, Supported = SupportsTag(currentContent, x.Key) })
                .ToList();

            if (widthAreas.Any(x => x.Supported))
            {
                foreach (var widthArea in widthAreas)
                {
                    var contentArea = new ContentArea();
                    contentArea.Add(currentContent);
                    var areaModel = new PreviewModel.PreviewArea
                        {
                            Supported = widthArea.Supported,
                            AreaTag = widthArea.Tag,
                            AreaName = widthArea.Tag,
                            ContentArea = contentArea
                        };
                    model.Areas.Add(areaModel);
                    if (!widthArea.Supported)
                    {
                        //If the width isn't supported we assume smaller widths won't be supported either
                        break;
                    }
                }
            }

            return View(model);
        }

        private bool SupportsTag(IContent content, string tag)
        {
            var contentsToBalance = new List<IContent> { content };

            var row = _rowBalancer.GetContentAreaRows(contentsToBalance, HttpContext, tag).SingleOrDefault();
            if(row == null)
            {
                return false;
            }

            var rowItem = row.SingleOrDefault();
            if(rowItem == null)
            {
                return false;
            }

            return !rowItem.IsEditorMessage;
        }

        public void ModifyLayout(LayoutModel layoutModel)
        {
            layoutModel.HideHeader = true;
            layoutModel.HideFooter = true;
        }
    }
}
