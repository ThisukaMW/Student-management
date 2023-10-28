
const txtFirstName = document.getElementById('txt-FirstName');
const txtLastName = document.getElementById('txt-LastName');
const txtBday = document.getElementById('txt-bday');
const txtEmail = document.getElementById('txt-username');
const txtpw = document.getElementById('txt-pw');
const txtInstitute = document.getElementById('txt-institute');
const txtBatch = document.getElementById('txt-batch');
const gender = document.getElementsByName('gender');


const btnSubmit = document.getElementById('btn-submit');
btnSubmit.addEventListener("click", () => {

    let selectedGender;
    for (var i = 0; i < gender.length; i++) {
        if (gender[i].checked) {
            selectedGender = gender[i].value;
        }
    }

    let info = {
        "firstName": txtFirstName.value,
        "lastName": txtLastName.value,
        "age": txtBday.value,
        "email": txtEmail.value,
        "password" : txtpw.value,
        "institute": txtInstitute.value,
        "batch": txtBatch.value,
        "gender": selectedGender
    }

    fetch("http://localhost:8080/information", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)
    })
})

