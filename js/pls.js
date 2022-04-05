function onClickActions(id){
     let cb= document.getElementById(id);
     console.log("Is Checked is :"+cb.checked)
    if(cb.checked)
    window.location.assign("http://127.0.0.1:5500/screens/consent_form.html");
    else{
        alert("Pleas read Plain Language Statement to Proceed.")
    }
}

