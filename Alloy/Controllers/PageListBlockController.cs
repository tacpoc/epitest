using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using EPiServer.Core;
using EPiServer.Filters;
using EPiServer.Templates.Alloy.Business;
using EPiServer.Templates.Alloy.Models.Blocks;
using EPiServer.Templates.Alloy.Models.ViewModels;
using EPiServer.Web.Mvc;

namespace EPiServer.Templates.Alloy.Controllers
{
    public class PageListBlockController : BlockController<PageListBlock>
    {
        private ContentLocator contentLocator;
        private IContentLoader contentLoader;
        public PageListBlockController(ContentLocator contentLocator, IContentLoader contentLoader)
        {
            this.contentLocator = contentLocator;
            this.contentLoader = contentLoader;
        }

        public override ActionResult Index(PageListBlock currentBlock)
        {
            var pages = FindPages(currentBlock);

            pages = Sort(pages, currentBlock.PageListSortOrder);
            
            if(currentBlock.PageListCount > 0)
            {
                pages = pages.Take(currentBlock.PageListCount);
            }

            var model = new PageListModel(currentBlock)
                {
                    Pages = pages
                };

            ViewData.GetEditHints<PageListModel, PageListBlock>()
                .AddConnection(x => x.Heading, x => x.PageListHeading);

            return PartialView(model);
        }

        private IEnumerable<PageData> FindPages(PageListBlock currentBlock)
        {
            IEnumerable<PageData> pages;
            var listRoot = currentBlock.PageListRoot;
            if (currentBlock.PageListRecursive)
            {
                if (currentBlock.PageListPageTypeFilter != null)
                {
                    pages = contentLocator.FindPagesByPageType(listRoot, true, currentBlock.PageListPageTypeFilter.ID);
                }
                else
                {
                    pages = contentLocator.GetAll<PageData>(listRoot);
                }
            }
            else
            {
                if (currentBlock.PageListPageTypeFilter != null)
                {
                    pages = contentLoader.GetChildren<PageData>(listRoot)
                        .Where(p => p.PageTypeID == currentBlock.PageListPageTypeFilter.ID);
                }
                else
                {
                    pages = contentLoader.GetChildren<PageData>(listRoot);
                }
            }

            if (currentBlock.PageListCategoryFilter != null && currentBlock.PageListCategoryFilter.Any())
            {
                pages = pages.Where(x => x.Category.Intersect(currentBlock.PageListCategoryFilter).Any());
            }
            return pages;
        }

        private IEnumerable<PageData> Sort(IEnumerable<PageData> pages, FilterSortOrder sortOrder)
        {
            var asCollection = new PageDataCollection(pages);
            var sortFilter = new FilterSort(sortOrder);
            sortFilter.Sort(asCollection);
            return asCollection;
        }
    }
}
