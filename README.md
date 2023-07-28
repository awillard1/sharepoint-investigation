# sharepoint-investigation
SharePoint JavaScript/API Investigation

Due to discovery of XSS in SharePoint On-Premise and Microsoft 365 this past year (along with a few in the past), I was asked to see what could be done with the XSS. I hosted a few JavaScript files during the investigation since I was able to inject a script tag and use the src attribute to link to the hosted files.

I also was able to use a version of SharePoint that had the aspx file rendering and I was able to use that to create files with embedded payloads and made the files look like they belonged in SharePoint.

What was I able to do if a user accessed the XSS:
- Steal any user's files (hidden,private,public)
- Delete any user's files
- Anything else the API allowed us to do

The interactions happened against the drive API and also could be done using graphql.

The Delete required the stealing of tokens from other requests. This can be seen in the following function calls of delete_files.js
- stealBearer
- getDigest

