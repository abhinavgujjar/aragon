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
    var ForAppending = 8;
var TristateTrue = -1;
var fso = new ActiveXObject("Scripting.FileSystemObject");
var newLine = fso.OpenTextFile("Error.txt", ForAppending, true, TristateTrue);
newLine.Write("Hello World!\n")
newLine.Close
}
