# sharepoint-investigation
SharePoint JavaScript/API Investigation

Due to discovery of XSS in SharePoint On-Premise and Microsoft 365 this past year (along with a few in the past), I was asked to see what could be done with the XSS. I hosted a few JavaScript files during the investigation since I was able to inject a script tag and use the src attribute to link to the hosted files.

I also was able to use a version of SharePoint that had the aspx file rendering and I was able to use that to create files with embedded payloads and made the files look like they belonged in SharePoint.

What was I able to do if a user accessed the XSS:
- Steal any user's files (hidden,private,public)
- Delete any user's files
- Upload any file to the user's sharepoint drive
- Anything else the API allowed us to do

The interactions happened against the drive API and also could be done using graphql.

The Delete required the stealing of tokens from other requests. This can be seen in the following function calls of delete_files.js
- stealBearer
- getDigest

I did not have a lot of time to look into discovering who the victim would be, so I had to come up with a quick and dirty way of identifying them:
```
document.write("<iframe src='/' id='whoareu' border=0 width=1 height=1></iframe>");const myTimeout = setTimeout(whoareu, 2000);
function whoareu() {
	var theurl=document.getElementById('whoareu').contentWindow.location.href;
	user = new URL(theurl).pathname.split('/')[2];
	// REST OF FUNCTION REMOVED AS NOT NECESSARY
}
```
In the above, I needed an iframe to hit the root of the SharePoint instance and it would redirect the user to their directory. Then I could parse the information out to be used for the Upload and Delete functions.

For the listing of all of a user's files, it was simple enough to just call out to the drive API:
- var t = "/_api/v2.1/drive/items/root";
