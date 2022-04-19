function onClickActions(id) {
    let cb = document.getElementById(id);
    console.log("Is Checked is :" + cb.checked)
    if (cb.checked) {
        console.log("Is Checked is :" + cb.checked)
        return true

//         //window.location.assign("http://127.0.0.1:5500/screens/consent_form.html");
//         // var xhr = new XMLHttpRequest();
//         // xhr.open("POST", "http://localhost:3000/pls", true);
//         // xhr.setRequestHeader('checkbox', true);
//         // xhr.send(JSON.stringify(true));

//         let xhr = new XMLHttpRequest();
//         xhr.open("POST", "http://localhost:3000/pls", true);

//         xhr.setRequestHeader("Content-Type", "application/json");
//         xhr.onload= function(){
//              let xhr2 = new XMLHttpRequest();
//              xhr2.open("GET", "http://localhost:3000/pls", true);
//              xhr2.send(JSON.stringify({done:true}))
             
//          }

// //         let data = `{
// //   "Id": 78912,
// //   "Customer": "Jason Sweet",
// // }`;


//         xhr.send(JSON.stringify({checked: true}));


    } else {
        alert("Pleas read Plain Language Statement to Proceed.")
        return false
    }
}

