
const email = document.getElementById('inputUN');
const password = document.getElementById('inputpw');
const btnLogin = document.getElementById('btn-log');

btnLogin.addEventListener('click',()=>{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
       method: "GET",
       headers: myHeaders,
       redirect: "follow",
     };
 
     fetch(`http://localhost:8080/information/${email.value}/${password.value}`, requestOptions)
     .then((response) => response.json())
     .then(res=>{
       console.log(res);
       if(res===true){
          window.open("../login.html" ,"_top");
       }else{
          alert("incorrect details");
       }
     })
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
