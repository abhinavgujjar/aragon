
function trackingPages(groupId,moduleId,status,sessionId) {
// Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        fileSystem.root.getFile("Track.csv", {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
    var username = document.loginForm.exampleInputEmail1.value;
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    if (minutes < 10){
    minutes = "0" + minutes
     }
    writer.seek(writer.length);
    writer.write(sessionId+"_"+username+","+status+","+username+","+month+ "/" +day+ "/" + year +","+hours + ":" + minutes+","+groupId+","+moduleId+"\n");
    writer.abort();
    writer.onwriteend = function(evt) {
        console.log("Write Success")
    };
    }

    function fail(error) {
        console.log(error.code);
    }
}

    
