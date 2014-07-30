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
// Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwrite = function(evt) {
        console.log("write success");
    };
    writer.write("some sample text");
    writer.abort();
    };

    function fail(error) {
        console.log(error.code);
    }

}
