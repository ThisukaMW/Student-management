const studentTable = document.getElementById("tbl-viewStudents");

async function viewStudent() {
  let tblBody = `
    <tr>
    <th>ID</th>
    <th>First Name</th>
    <th>Last Name</th>
    <th>age</th>
    <th>Email Address</th>
    <th>Institute</th>
    <th>Batch</th>
    <th>Gender</th>
</tr>`;

  try {
    // The API is paginated; 100 is the largest page it allows
    const result = await apiRequest("/students?size=100&sort=id,asc");
    if (!result.ok) {
      alert(describeApiError(result.data));
      return;
    }

    result.data.content.forEach((element) => {
      tblBody += `<tr>
    <td>${escapeHtml(element.id)}</td>
    <td>${escapeHtml(element.firstName)}</td>
    <td>${escapeHtml(element.lastName)}</td>
    <td>${escapeHtml(element.age)}</td>
    <td>${escapeHtml(element.email)}</td>
    <td>${escapeHtml(element.institute)}</td>
    <td>${escapeHtml(element.batch)}</td>
    <td>${escapeHtml(element.gender)}</td>
</tr> `;
    });
    studentTable.innerHTML = tblBody;
  } catch (e) {
    alert(SERVER_UNREACHABLE);
  }
}

viewStudent();
