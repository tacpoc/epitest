using System;
using System.Collections.Generic;
using EPiServer.Shell.ObjectEditing;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;
using EPiServer.Templates.Alloy.Models.Blocks;

namespace EPiServer.Templates.Alloy.Business.EditorDescriptors
{
    /// <summary>
    /// Editor descriptor to enable editor to drag and drop an image from File Manager to the logotype block to change the logotype image
    /// </summary>
    [EditorDescriptorRegistration(TargetType = typeof(SiteLogotypeBlock))]
    public class SiteLogotypeBlockEditorDescriptor : EditorDescriptor
    {
        public override void ModifyMetadata(ExtendedMetadata metadata, IEnumerable<Attribute> attributes)
        {
            base.ModifyMetadata(metadata, attributes);

            // We allow objects with a file URL, such as an image from File Manager, to be dropped on the logotype block...
            metadata.AdditionalValues["DropTargetType"] = new [] { "fileurl" };

            // ...and when it is dropped we map the object (i.e. the URL) to the logotype's image URL property
            metadata.AdditionalValues["DropTargetChildProperty"] = "SiteLogotypeUrl";
        }
    }
}