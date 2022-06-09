function onClickActions(id) {
    let cb = document.getElementById(id);
    console.log("Is Checked is :" + cb.checked)
    if (cb.checked) {
        console.log("Is Checked is :" + cb.checked)
        return true



    } else {
        alert("Pleas read Plain Language Statement to Proceed.")
        return false
    }
}

