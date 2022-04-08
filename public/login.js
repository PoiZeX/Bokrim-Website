
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();


});


function googleLogin() {
    // function for log in via google
    var logStatus = sessionStorage.getItem("LoggedIn");
    const provider = new firebase.auth.GoogleAuthProvider();

    if(logStatus == 0){
        firebase.auth().signInWithPopup(provider)
            .then(result => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const user = result.user;
                sessionStorage.setItem("LoggedIn", 1);
                //document.write(`Hello ${user.displayName} and ${token}`);
                sessionStorage.setItem("userNameC", user.displayName);
                sessionStorage.setItem("userRank", "employee"); // everyone starts from employee.
                reDirect();
                console.log(user)
    
            })
            .catch(console.log)
    }
    else{
        alert("אתה כבר מחובר");
    }
}

function quit(){
    // the log out function
    var logStatus = sessionStorage.getItem("LoggedIn");
    if (logStatus == 1){                            // already logged in?
        firebase.auth().signOut().then(() => {
            sessionStorage.setItem("LoggedIn", 0);  // update log status to log out
            alert("נותקת")
            sessionStorage.removeItem("userNameC")
            sessionStorage.removeItem("userRank")
            
            window.location.href = "index.html"
            // Sign-out successful.
          }).catch((error) => {
            alert("Unexcpected error. Try again")
          });
          
    }
    else{
        alert("אינך מחובר");
    }
    
      
}