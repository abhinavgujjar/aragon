// Note: Like all Javascript password scripts, this is hopelessly insecure as the user can see 
//the valid usernames/passwords and the redirect url simply with View Source.  
// And the user can obtain another three tries simply by refreshing the page.  
//So do not use for anything serious!


function LoginClick() {
var un = document.loginForm.exampleInputEmail1.value;
var pw = document.loginForm.exampleInputPassword1.value;
if (un=="quest") {
    if(pw=="123"){
       location.href = '#/landing';
       readFile();
    }
    else{
        alert("Invalid login!");
    }
}
}

function readFile() {
// Wait for Cordova to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    //
    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        fileSystem.root.getFile("/sdcard/track.txt", {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            console.log("contents of file now 'some sample text'");
            writer.truncate(11);  
            writer.onwriteend = function(evt) {
                console.log("contents of file now 'some sample'");
                writer.seek(4);
                writer.write(" different text");
                writer.onwriteend = function(evt){
                    console.log("contents of file now 'some different text'");
                }
            };
        };
        var currentTime=new Date();
        var uusername = document.loginForm.exampleInputEmail1.value;
        var password = document.loginForm.exampleInputPassword1.value;
        writer.write("Hi its working");
        writer.newLine();
    }

    function fail(error) {
        console.log(error.code);
    }
}
