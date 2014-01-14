Every time the project is built, the following is done by the MSBuild scripts in the [MSBuild] folder:

1. Retrieve default EPiServer configuration files from the "[Configuration]\EPiServer" folder

2. Apply common config transforms from the "[Configuration]\Common" folder

3. Apply build configuration-specific transforms from the "[Configuration]\BUILDCONFIGNAME" folder
   (where BUILDCONFIGNAME is the current build configuration name, such as "Debug" or "Release")

4. Overwrite any existing configuration files in the site root

Note: The MSBuild scripts are executed through a post-build event.

Make sure all files in this folder have their Build Action set to "None" 
to avoid this folder being included when performing a Publish.