
function LoginAttempt() {
    const app = firebase.app();
    var username = document.getElementById("username");
    var passwd = document.getElementById("psw");
    const db = firebase.firestore();

    const userInfo = db.collection('users');
    const query = userInfo.where('name', '==', username.value);  // search by name
            
        if (query == null)
                alert("ERROR");
        else
        {   
            query.get()
            .then(users => {
                users.forEach(doc => {
                    data = doc.data()
                if(passwd.value == data.password)
                {
                    console.log(data.password);
                    // success
                    sessionStorage.setItem("userRank", data.rank);
                    sessionStorage.setItem("userNameC", username.value);
                    sessionStorage.setItem("LoggedIn", 1);
                    sessionStorage.setItem("id", data.id);
                    reDirect();
                }
                else
                alert("סיסמה שגויה");
                })
                
            })
        }
            
}
function reDirect(){
    // this function checks if the user has already logged in to the system and re-direct him

    // if user already connected
    var loggedStatus = sessionStorage.getItem("LoggedIn");
    var userNameC = sessionStorage.getItem("userNameC");
    var userRank = sessionStorage.getItem("userRank");
    if(loggedStatus == 1)
    {
        if (userRank == "employee") {
            window.location.href = "employee.html";
    
        }
        else if (userRank == "manager") {
            window.location.href = "manager.html";
        }
        else{
            // this error can be because user has logged in but with no rank.
            alert("no rank has attach");
        }
    }
    // else -> continue
}



function toggleHide() {
    // toggle hide or show the OTP section
    var element = document.getElementById("OTP");
    if (element.style.display === "none") {
        element.style.display = "inline";
    } else {
        element.style.display = "none";
    }
}
var managerPages = ["/manager.html", "/confirmRep.html", "/manager-shifts.html", "/Totsalary.html", "/upload.html"];
var empPages = ["/employee.html", "/Allshifts.html", "/mealPay.html", "/paycheck.html", "/Shifts.html", "/salary-emp.html", "/settings.html"]
function checkRightRank(){
    // for manager pages
    for(var i =0; i<5;i++)
    {   // not a manager try to enter the manager pages
        if((window.location.pathname == managerPages[i]) && (sessionStorage.getItem("userRank") != "manager"))
            return false; 
    }
    for(var i =0; i<6;i++)
    {   // not a logged in user try to get in for the system
        if((window.location.pathname == empPages[i]) && ((sessionStorage.getItem("userRank") != "employee")  && (sessionStorage.getItem("userRank") != "manager") ))
            return false; 
    }
        
    return true;
}

function welcome() {
    // the function gets the rank and name of the signed in user
    // and welcome him
     if(checkRightRank() == false)  // redirect unauthorized 
        window.location.href = "index.html";
    else
    {
        var userNameC = sessionStorage.getItem("userNameC");
        var userRank = sessionStorage.getItem("userRank");
        document.getElementById("headline").innerHTML = "!" + userNameC + " ברוך הבא";
        if (userRank == "employee") 
            userRank = "עובד";
        else 
            userRank = "מנהל";
        document.getElementById("rank").innerHTML = "מחובר כ" + userRank;

    }
    
}
function checkall(element, num) {
// this function get the element and day, And check all boxes of the same morning.
    var checkboxes = document.getElementsByName(num);
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != element)
            checkboxes[i].checked = element.checked;
    }
}

// Pass the checkbox name to the function
function getCheckedBoxes(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    // loop over them all
    for (var i = 0; i < checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i]);
        }
    }
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

function ShowSalary() {
    const db = firebase.firestore();

    const salary = db.collection('Salary');
    const query = salary.where('date', '>=', document.getElementById("shiftDate").value); 
        if (query == null)
                alert("ERROR");
        else
        {
            var count = 0;
            query.get()
            .then(salary => {
                salary.forEach(doc => {
                    let cell = document.createElement("tr");
                    let a = document.createElement("th");
                    let b = document.createElement("th");
                    let c = document.createElement("th");
                    cell.appendChild(c);
                    cell.appendChild(b);
                    cell.appendChild(a);
                    document.getElementById("salaryTabel").append(cell);
                    data = doc.data()
                    var shift = data.Shift == 0 ? "ערב" : "בוקר";
                    a.innerHTML = `${data.date}`;
                    b.innerHTML = `${shift}`;
                    c.innerHTML = `${data.salary}₪`;
                })
            })
        }
            
}

function changePassword(){
    const app = firebase.app();
    const db = firebase.firestore();
    console.log(sessionStorage.getItem('id'));
    const specific = db.collection('users').doc(sessionStorage.getItem('id'));
    
    specific.get()
        .then(doc => {
            const userData = doc.data();
            specific.update({
                password: document.getElementById("newPSW").value
            })
        })
    alert("הסיסמה שונתה בהצלחה! ");
}

function showReports(){
    // this function builds the page
    const db = firebase.firestore();

    var sideDB = db.collection('totalData').doc('stats');  // to know how many reports are stored
    var reportsDB = db.collection('Salary');              // find them
    var query = reportsDB.where('approve', '==', false);  // search by year

    var count = 0;
    sideDB.get()
            .then(doc => {
                const data = doc.data();
                count = data.unapprove;
                if(count != 0)
                {
                    
                    //
                    document.getElementById("numofReps").innerHTML = `יש ${count} דוחות לאישור` ;
                    query.get()
                    .then(Salary => {
                        Salary.forEach(doc =>{
                            var data2 = doc.data();
                            {
                                count--;
                                // build the table
                                let cell = document.createElement("tr");
                                let a = document.createElement("th");
                                let b = document.createElement("th");
                                let c = document.createElement("th");
                                cell.appendChild(c);
                                cell.appendChild(b);
                                cell.appendChild(a);
                                document.getElementById("confirmTable").append(cell);
                                // found all the unapprove reprots
                                let shift = data2.shift == 0 ? "ערב" : "בוקר";
                                c.innerHTML = data2.salary;
                                b.innerHTML = shift;
                                a.innerHTML = data2.date;
                            }
                        })
                        
                    })
                }
                else
                    document.getElementById("numofReps").innerHTML = "אין דוחות לאישור" ;
            })
}

function confirmRep()
{
    // when button pressed
    const db = firebase.firestore();
    var salaryDB = db.collection("Salary");
    var totalData = db.collection("totalData").doc("stats");
    totalData.get()
        .then(doc => {
        let tData = doc.data();
        let totRep = tData.totalReports;
        let un = tData.unapprove;
        let sum = totRep - un;
        while(sum <= totRep+1){
            salaryDB.doc(`${sum}`).update({
                approve: true
            })
            sum++;
        }
       
        return totalData.update({  // update the number of unapproval reports
            unapprove: 0
        })
    })

    alert("הדוח אושר");    // show message
    //    window.location.href = "manager.html";  // back to menu

}


function shiftAct(enterORexit){
    // function for enter or leaving the current shift
    const db = firebase.firestore();
    let id = sessionStorage.getItem("id");
    var userDB = db.collection("users").doc("1");  // fields of users
    var shiftAction = userDB.collection("selfReport");  // the report section
    var today = new Date();
    var currentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let hour = today.getHours(); //returns value 0-23 for the current hour
    let shift = hour < 18 ? 0 : 1; // until 18:00 it is a morning shift, else evening..
    shiftAction.get()
    .then(doc => {
        if(enterORexit == 0){
            if(doc.exist)
                alert("אתה כבר במערכת");
            else{
                shiftAction.doc(`${currentDate}`).set({
                    start: hour,
                    end: hour, // to be updated next
                    dailySal: 0, // to be updated next
                    shift: shift
                })
                alert("נכנסת למערכת בהצלחה")
            }
            
        }
        else{
            shiftAction.doc(`${currentDate}`).update({
                end: hour,
            })
            alert("ביצעת יציאה מהמערכת")

        }
    
})
}


var Tempdate, TempSalary, shift;
function dailySalary(){
    // this function handels the salary calculates and update
    const db = firebase.firestore();
    var temp = db.collection("Salary");
    var totalData = db.collection("totalData").doc("stats");
    shift = 0;  // defualt as morning shift
    Tempdate = document.getElementById("shiftDate").value;
    TempSalary = parseInt(document.getElementById("sum").value)
    if(TempSalary > 0)
    {
       if (document.getElementById("nightShift").checked)
            shift = 1;

    totalData.get()
        .then(doc => {
        const dataAPPROVE = doc.data();
        temp.doc(`${dataAPPROVE.totalReports + 1}`).set({
            date: Tempdate,
            salary: TempSalary,
            Shift: shift,
            approve: false
        })
        updateSalary(Tempdate, shift, TempSalary);
        totalData.update({  // update the number of unapproval reports
            unapprove: dataAPPROVE.unapprove+1
        })
        totalData.update({
            totalReports: dataAPPROVE.totalReports+1
        })

    })
           
    alert("!התווסף בהצלחה");
    }
    else
        alert("פרטים שגויים");
 
}

function updateSalary(searchDate, shift, totMoney){
    // not finished
    const db = firebase.firestore();
    var temp = db.collection("users").doc("1").collection("selfReport").doc('2022-02-20');
    let totHours = 0;  
    temp.get()
        .then(doc => {
            var tempData = doc.data();
                if(tempData.shift == shift)
                    totHours += (tempData.end - tempData.start);
                console.log(totHours);     // how many employees in the shift
            });
    let avgMoney = totMoney/totHours;                                  // money per hour
    temp.get()
    .then(doc => {
            console.log(temp.data().end);
            console.log(avgMoney*(temp.data().end - temp.data().start));
        if(temp.data.shift == shift)
        query.update({
            selfSalary: avgMoney*(temp.data().end - temp.data().start)
        })
    })
          
}


function sendShifts(){
    alert("המשמרות נשלחו בהצלחה");
    window.location.href = "employee.html";
}
function publish(){
    alert("הסידור זמין לצפייה עבור המלצרים");
    window.location.href = "/index.html";``
}