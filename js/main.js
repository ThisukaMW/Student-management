
const email = document.getElementById('inputUN');
const password = document.getElementById('inputpw');
const btnLogin = document.getElementById('btn-log');

btnLogin.addEventListener('click', async () => {
    try {
        const result = await apiRequest("/auth/login", {
            method: "POST",
            body: { email: email.value, password: password.value }
        });

        if (result.ok) {
            window.location.href = "login.html";
        } else if (result.status === 401) {
            alert("Incorrect email or password");
        } else {
            alert(describeApiError(result.data));
        }
    } catch (e) {
        alert(SERVER_UNREACHABLE);
    }
})



const btnShowPassWord = document.getElementById('showpw');
btnShowPassWord.addEventListener("click", () => {

    if (password.type == 'password') {
        password.type = 'text';
        btnShowPassWord.textContent = 'Hide Password';
    } else {
        password.type = 'password';
        btnShowPassWord.textContent = 'Show Password';
    }
})
