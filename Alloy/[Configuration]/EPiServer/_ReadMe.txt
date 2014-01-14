This folder contains default configuration files from EPiServer.

We apply config transform instead of modifying these files directly.

This makes version upgrades easier, and also makes it easy to see which parts
of the standard EPiServer configuration have been added/modified for the site.

Make sure all files in this folder have their Build Action set to "None" 
to avoid this folder being included when performing a Publish.