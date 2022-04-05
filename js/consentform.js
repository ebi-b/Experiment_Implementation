function onClickActions(id){
    let cb= document.getElementById(id);
    console.log("Is Checked is :"+cb.checked)
   if(cb.checked)
   window.location.assign("http://127.0.0.1:5500/screens/intro.html");
   else{
       alert("Pleas accept the consent form to proceed...")
   }
}

