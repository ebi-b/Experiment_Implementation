aep_value = 0
alp_value = 0
ffp_value = 0
fmp_value = 0
mp_value = 0
stmp_value = 0
sap_value = 0
scatp_value = 0
sconp_value = 0
sep_value = 0
spp_value = 0
sqp_value = 0
tfp_value = 0
vlp_value = 0
vpp_value = 0
vtp_value = 0
vp_value = 0
mrq_values = []


function onload_actions() {
    console.log("I,m here")
    tableInputDiv = document.getElementById("divtablemrq");
    textfields = tableInputDiv.getElementsByClassName("mrqtxtin");
    console.log(textfields.length);
    for (bi = 0; bi < textfields.length; bi++) {
        textfields[bi].addEventListener('input', updateValue);
        textfields[bi].addEventListener('change', updateValue);
    }
}
function submitButtionFunction() {
    tableInputDiv = document.getElementById("divtablemrq");
    textfields = tableInputDiv.getElementsByClassName("mrqtxtin");
    console.log("Button Clicked");
    emptyfield_alert = false
    wrong_value_alert = false
    for (bi = 0; bi < textfields.length; bi++) {
        value = textfields[bi].value;


        if (value == "") {
            emptyfield_alert = true;
        } else if (value == 0 || value == 1 || value == 2 || value == 3 || value == 4) {
            mrq_values[bi] = value
        } else {
            wrong_value_alert = true


        }
    }
    //console.log(mrq_values)

    s = ""
    console.log(wrong_value_alert)
    if (emptyfield_alert)
        s = s + " Fill in all the boxes."
    if (wrong_value_alert)
        s = s + " The only accepted values are 0,1,2 and 3."

    if (s != "")
        alert(s)

    if (!emptyfield_alert && !wrong_value_alert)
        return true
    else return false
}

function updateValue(e) {
    txtfld = document.getElementById(e.target.id)
    txtfld
    value = e.target.value
    if (value == "") {
        txtfld.style.border = "5px solid red";
    }
    else if (value == 0 || value == 1 || value == 2 || value == 3 || value == 4) {
        txtfld.style.border = "5px solid green";
    }
    else {
        txtfld.style.border = "5px solid red";


    }

    //txtfld.style.backgroundColor = "red";
    console.log(e.target.value)
}