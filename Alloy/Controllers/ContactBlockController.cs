﻿using System.Web;
using System.Web.Mvc;
using EPiServer.Core;
using EPiServer.Templates.Alloy.Helpers;
using EPiServer.Templates.Alloy.Models.Blocks;
using EPiServer.Templates.Alloy.Models.Pages;
using EPiServer.Templates.Alloy.Models.ViewModels;
using EPiServer.Web;
using EPiServer.Web.Mvc;

namespace EPiServer.Templates.Alloy.Controllers
{
    public class ContactBlockController : BlockController<ContactBlock>
    {
        private readonly IContentLoader _contentLoader;
        private readonly IPermanentLinkMapper _permanentLinkMapper;

        public ContactBlockController(IContentLoader contentLoader, IPermanentLinkMapper permanentLinkMapper)
        {
            _contentLoader = contentLoader;
            _permanentLinkMapper = permanentLinkMapper;
        }

        public override ActionResult Index(ContactBlock currentBlock)
        {
            ContactPage contactPage = null;
            if(!ContentReference.IsNullOrEmpty(currentBlock.ContactPageLink))
            {
                contactPage = _contentLoader.Get<ContactPage>(currentBlock.ContactPageLink);
            }

            var linkUrl = GetLinkUrl(currentBlock);
            
            var model = new ContactBlockModel
                {
                    Heading = currentBlock.ContactBlockHeading,
                    Image = currentBlock.ContactBlockImage,
                    ContactPage = contactPage,
                    LinkUrl = GetLinkUrl(currentBlock),
                    LinkText = currentBlock.ContactBlockLinkText,
                    ShowLink = linkUrl != null
                };

            //As we're using a separate view model with different property names than the content object
            //we connect the view models properties with the content objects so that they can be edited.
            ViewData.GetEditHints<ContactBlockModel, ContactBlock>()
                .AddConnection(x => x.Heading, x => x.ContactBlockHeading)
                .AddConnection(x => x.Image, x => x.ContactBlockImage)
                .AddConnection(x => (object) x.ContactPage, x => (object) x.ContactPageLink)
                .AddConnection(x => x.LinkText, x => x.ContactBlockLinkText);

            return PartialView(model);
        }

        private IHtmlString GetLinkUrl(ContactBlock contactBlock)
        {
            if (contactBlock.ContactBlockLinkUrl != null && !contactBlock.ContactBlockLinkUrl.IsEmpty())
            {
                var linkUrl = contactBlock.ContactBlockLinkUrl.ToString();

                //If the url maps to a page on the site we convert it from the internal (permanent, GUID-like) format
                //to the human readable and pretty public format
                var linkMap = _permanentLinkMapper.Find(new UrlBuilder(linkUrl)) as PermanentContentLinkMap;
                if (linkMap != null && !ContentReference.IsNullOrEmpty(linkMap.ContentReference) && linkMap.ContentReference is PageReference)
                {
                    return Url.PageLinkUrl((PageReference)linkMap.ContentReference);
                }

                return new MvcHtmlString(contactBlock.ContactBlockLinkUrl.ToString());
            }

            return null;
        }

    }
}
