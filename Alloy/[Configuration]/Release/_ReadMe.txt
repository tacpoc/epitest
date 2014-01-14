This folder contains config transform files for the production environement,
when the build configuration has been set to "Release".

These files specify differences from the "Common" configuration.

Every time the project is built in "Release" mode, these config transforms are applied
and the resulting configuration files are copied to the site root.

Make sure all files in this folder have their Build Action set to "None" 
to avoid this folder being included when performing a Publish.