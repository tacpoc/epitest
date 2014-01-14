This folder contains all assemblies that this project depends on except for the ones provided by Nuget packages.

Assembly references should be added from this folder, where applicable.

This folder (and any subfolders) should be added as Reference Paths in
the project properties to ensure assembly references point here instead
of the GAC, even if the DLL files themselves aren't included in the project.

Make sure all files in this folder have their Build Action set to "None" 
to avoid this folder being included when performing a Publish.