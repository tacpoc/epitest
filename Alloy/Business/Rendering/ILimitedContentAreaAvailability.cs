namespace EPiServer.Templates.Alloy.Business.Rendering
{
    /// <summary>
    /// Defines a property by which a page or block can require a minimum width when
    /// rendered in a content area with a size tag.
    /// </summary>
    interface ILimitedContentAreaAvailability
    {
        int MinimumWidthInContentArea { get; } 
    }
}
