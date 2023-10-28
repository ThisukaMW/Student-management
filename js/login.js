const studentTable = document.getElementById("tbl-viewStudents");

function viewStudent(){

fetch("http://localhost:8080/information")
  .then((response) => response.json())
  .then((res) => {
    console.log(res);
    let tblBody = `
    <tr>
    <th>ID</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>age</th>
    <th>Email Address</th>
    <th>password</th>
    <th>Institute</th>
    <th>Batch</th>
    <th>Gender</th>
</tr>`;

    res.forEach((element) => {
      tblBody += `<tr>
    <td>${element.id}</td>
    <td>${element.firstName}</td>
    <td>${element.lastName}</td>
    <td>${element.age}</td>
    <td>${element.email}</td>
    <td>${element.password}</td>
    <td>${element.institute}</td>
    <td>${element.batch}</td>
    <td>${element.gender}</td>
    

</tr> `;
    });
    studentTable.innerHTML = tblBody;
  });
}

viewStudent();
