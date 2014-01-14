using System.Web;
using System.ComponentModel.DataAnnotations;
using EPiServer.Templates.Alloy.Models.Pages;
using EPiServer.Web;

namespace EPiServer.Templates.Alloy.Models.ViewModels
{
    public class ContactBlockModel
    {
        [UIHint(UIHint.Image)]
        public Url Image { get; set; }
        public string Heading { get; set; }
        public string LinkText { get; set; }
        public IHtmlString LinkUrl { get; set; }
        public bool ShowLink { get; set; }
        public ContactPage ContactPage { get; set; }
    }
}