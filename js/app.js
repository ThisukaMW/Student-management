
const txtFirstName = document.getElementById('txt-FirstName');
const txtLastName = document.getElementById('txt-LastName');
const txtBday = document.getElementById('txt-bday');
const txtEmail = document.getElementById('txt-username');
const txtpw = document.getElementById('txt-pw');
const txtInstitute = document.getElementById('txt-institute');
const txtBatch = document.getElementById('txt-batch');
const gender = document.getElementsByName('gender');


const btnSubmit = document.getElementById('btn-submit');
btnSubmit.addEventListener("click", async () => {

    let selectedGender = null;
    for (let i = 0; i < gender.length; i++) {
        if (gender[i].checked) {
            selectedGender = gender[i].value.toUpperCase();
        }
    }

    const ageText = txtBday.value.trim();

    let info = {
        "firstName": txtFirstName.value,
        "lastName": txtLastName.value,
        "age": ageText === "" ? null : Number(ageText),
        "email": txtEmail.value,
        "password": txtpw.value,
        "institute": txtInstitute.value,
        "batch": txtBatch.value,
        "gender": selectedGender
    }

    try {
        const result = await apiRequest("/students", { method: "POST", body: info });
        if (result.status === 201) {
            alert("Registration successful. You can now log in.");
            window.location.href = "content.html";
        } else {
            alert(describeApiError(result.data));
        }
    } catch (e) {
        alert(SERVER_UNREACHABLE);
    }
})
