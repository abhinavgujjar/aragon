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
function onDeviceReady() {

    //request the persistent file system
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, onError);
    
}

function init() {
    document.addEventListener("deviceready", onDeviceReady, true);
}
function onFSSuccess(fs) {
    fileSystem = fs;

    getById("#dirListingButton").addEventListener("touchstart",doDirectoryListing);            
    getById("#addFileButton").addEventListener("touchstart",doAppendFile);            
    getById("#readFileButton").addEventListener("touchstart",doReadFile);            
    getById("#metadataFileButton").addEventListener("touchstart",doMetadataFile);            
    getById("#deleteFileButton").addEventListener("touchstart",doDeleteFile);            
    
    logit( "Got the file system: "+fileSystem.name +"<br/>" +
                                    "root entry name is "+fileSystem.root.name + "<p/>")    

    doDirectoryListing();
}
function appendFile(f) {

    f.createWriter(function(writerOb) {
        writerOb.onwrite=function() {
            logit("Done writing to file.<p/>");
        }
        //go to the end of the file...
        writerOb.seek(writerOb.length);
        writerOb.write("Test at "+new Date().toString() + "\n");
    })

}

function doAppendFile(e) {
    fileSystem.root.getFile("test.txt", {create:true}, appendFile, onError);
}
}
